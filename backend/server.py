from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import io
import re
import traceback
import os
from pymongo import MongoClient
import gridfs
from bson import ObjectId
import jwt
from datetime import datetime, timedelta

# Secret key for JWT (should match frontend)
SECRET_KEY = "your_secret_key"

app = Flask(__name__)
CORS(app, resources={r"/process_tax_form": {"origins": "*"}})  # Allow frontend requests


CORS(app, origins="http://localhost:5173", supports_credentials=True)

TAX_TEMPLATE_PATH = r"C:\Users\cathe\OneDrive\Desktop\arag\backend\uploads\tax_template.pdf"
DOCUMENT_NAME = "Hauptvordruck ESt 1 A"

# Unified MongoDB Setup
client = MongoClient("mongodb://localhost:27017")
db = client['libraryDB']  # Use a single database (libraryDB)
users_collection = db["users"]  # Replace with your collection name

fs = gridfs.GridFS(db)  # GridFS for storing PDFs

# Get user collection from libraryDB
def get_user_collection():
    return db['users']  # Use 'users' collection inside libraryDB

def verify_token(token):
    """Decodes the JWT token and extracts user information"""
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token.get("user_id")  # Ensure the correct user_id is returned
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def extract_all_markers(pdf_path):
    """ Extract all markers (numbers, sub-items, letters) from the PDF. """
    doc = fitz.open(pdf_path)
    markers = {}

    for page_num in range(len(doc)):
        page = doc[page_num]
        words = page.get_text("words")
        for w in words:
            text = w[4].strip()
            if re.match(r'^\d+\.$', text) or re.match(r'^\d+[a-z]+\.$', text) or re.match(r'^[a-z]$', text):
                markers[text] = {
                    "page": page_num,
                    "position": (w[0], w[1]),
                    "rect": fitz.Rect(w[0], w[1], w[2], w[3])
                }
    return markers


def remove_all_markers_and_fill_answers(original_pdf, responses, markers):
    """ Removes all markers and fills the corresponding fields with user responses. """
    doc = fitz.open(original_pdf)

    for marker, info in markers.items():
        page = doc[info["page"]]
        position = info["position"]

        # Cover all detected markers
        page.draw_rect(info["rect"], color=(1, 1, 1), fill=True)

        # If this marker has a corresponding response, insert the answer
        if marker in responses:
            answer = responses[marker]
            text_position = (position[0] - 20, position[1] + 7)  # Adjust positioning
            page.insert_text(text_position, answer, fontsize=12, color=(0, 0, 0), overlay=True)

    # Save the filled PDF to an in-memory buffer
    pdf_bytes = io.BytesIO()
    doc.save(pdf_bytes)
    pdf_bytes.seek(0)  # Move pointer to start of the file

    return pdf_bytes


@app.route('/process_tax_form', methods=['POST'])
def process_tax_form():
    try:
        raw_data = request.get_json()
        if not raw_data:
            return jsonify({"error": "Invalid JSON format or empty request"}), 400

        user_responses = {k: v for k, v in raw_data.items()}
        markers = extract_all_markers(TAX_TEMPLATE_PATH)

        filled_pdf = remove_all_markers_and_fill_answers(TAX_TEMPLATE_PATH, user_responses, markers)

        # Get the user_id from the request
        user_id = raw_data.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Add the document name and timestamp
        document_name = "Hauptvordruck ESt 1 A"
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

        # ✅ Save PDF to MongoDB (GridFS)
        file_id = fs.put(filled_pdf.getvalue(), filename=f"{document_name}_{user_id}_{timestamp}.pdf")

        # ✅ Link PDF to user in `users` collection with document name and timestamp
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"tax_forms": {
                "file_id": file_id,
                "filename": f"{document_name}_{timestamp}.pdf",
                "document_name": document_name,
                "timestamp": timestamp
            }}}
        )

        # Save to Downloads folder with the same name and timestamp
        download_filename = f"{document_name}_{timestamp}.pdf"
        downloads_path = os.path.expanduser(f"~/Downloads/{download_filename}")
        with open(downloads_path, "wb") as f:
            f.write(filled_pdf.getvalue())

        # ✅ Return the filled PDF for download with the same name
        file_data = fs.get(file_id)  # Fetch the file from GridFS
        return send_file(io.BytesIO(file_data.read()), as_attachment=True, download_name=download_filename, mimetype="application/pdf")

    except Exception as e:
        print("Error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/download_tax_form/<file_id>", methods=["GET"])
def download_tax_form(file_id):
    try:
        file_data = fs.get(ObjectId(file_id))
        return send_file(io.BytesIO(file_data.read()), as_attachment=True, download_name=file_data.filename, mimetype="application/pdf")
    except Exception as e:
        print("Error fetching file:", e)
        return jsonify({"error": "File not found"}), 404


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = get_user(username, password)  # Verify user credentials

    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    # Create a token with the correct user_id
    token_payload = {
        "user_id": str(user['_id']),  # Ensure correct ID and convert to string
        "exp": datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }

    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token, "user_id": str(user['_id'])})


@app.before_request
def check_preflight():
    if request.method == "OPTIONS":  # Handle preflight requests
        return '', 200


@app.route("/")
def home():
    return "Flask server is running!"


@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not Found'}), 404

@app.route("/get_tax_forms/<user_id>", methods=["GET"])
def get_tax_forms(user_id):
    try:
        # Convert user_id to ObjectId
        user_object_id = ObjectId(user_id)

        # Fetch the user from the database
        user = users_collection.find_one({"_id": user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Fetch tax forms for the user
        tax_forms = user.get("tax_forms", [])

        # Prepare response data
        documents = [
            {
                "filename": form["filename"],
                "file_id": str(form["file_id"]),  # Convert ObjectId to string
                
            }
            for form in tax_forms
        ]

        return jsonify(documents), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5002)
