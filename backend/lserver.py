from flask import Flask, request, send_file
from flask_cors import CORS
import requests
from fpdf import FPDF
import os

app = Flask(__name__)
CORS(app)  

API_KEY = "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"

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  

# Translation function
def translate_english_to_german(text):
    translations = {
        "FROM": "Von",
        "TO": "An",
        "DATE": "Datum"
    }
    if text in translations:
        return translations[text]  # Return predefined translation
    
    API_URL = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that translates English to German. Provide ONLY the translated text, with no explanations."},
            {"role": "user", "content": text}
        ]
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
    except requests.exceptions.RequestException as e:
        return f"Translation API error: {str(e)}"

# API route to handle translation and PDF generation
@app.route('/translate', methods=['POST'])
def translate():
    if 'from' not in request.form or 'to' not in request.form:
        return {"error": "Invalid request. No form data received."}, 400

    # Extract text data
    from_address = request.form.get("from", "").strip()
    to_address = request.form.get("to", "").strip()
    date = request.form.get("date", "").strip()
    
    # Translate only the labels, not the actual address or date
    translated_from_label = translate_english_to_german("FROM")
    translated_to_label = translate_english_to_german("TO")
    translated_date_label = translate_english_to_german("DATE")

    salutation = translate_english_to_german(request.form.get("salutation", "").strip())
    subject = translate_english_to_german(request.form.get("subject", "").strip())
    body = translate_english_to_german(request.form.get("body", "").strip())
    closing = translate_english_to_german(request.form.get("closing", "").strip())

    # Handle signature upload
    signature_path = None
    if "signature" in request.files:
        signature_file = request.files["signature"]
        if signature_file.filename != "":
            file_extension = os.path.splitext(signature_file.filename)[1].lower()
            if file_extension not in [".png", ".jpg", ".jpeg"]:
                return {"error": "Invalid file format. Please upload a PNG or JPG image."}, 400
            
            signature_path = os.path.join(UPLOAD_FOLDER, "signature" + file_extension)
            signature_file.save(signature_path)

    # Create a PDF
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # FROM Address (Translated Label)
    pdf.set_font("Arial", style="B", size=12)
    pdf.cell(0, 6, f"{translated_from_label}:", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 6, from_address)
    pdf.ln(5)

    # TO Address (Translated Label)
    pdf.set_font("Arial", style="B", size=12)
    pdf.cell(0, 6, f"{translated_to_label}:", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 6, to_address)
    pdf.ln(5)

    # Date (Translated Label)
    pdf.set_font("Arial", style="B", size=12)
    pdf.cell(0, 6, f"{translated_date_label}: {date}", ln=True)
    pdf.ln(5)

    # Salutation
    pdf.set_font("Arial", style="B", size=12)
    pdf.multi_cell(0, 6, salutation)
    pdf.ln(5)

    # Subject
    pdf.set_font("Arial", style="B", size=12)
    pdf.cell(0, 6, f"Betreff: {subject}", ln=True)
    pdf.ln(5)

    # Body
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 6, body)
    pdf.ln(10)

    # Closing (Now properly formatted)
    pdf.set_font("Arial", style="B", size=12)
    pdf.multi_cell(0, 6, closing)
    pdf.ln(10)  # Extra space before signature

    # Add signature image (No text label)
    if signature_path:
        pdf.image(signature_path, x=10, w=50)

    # Save the PDF
    pdf_path = "translated_letter.pdf"
    pdf.output(pdf_path)

    return send_file(pdf_path, as_attachment=True, download_name="translated_letter.pdf")

if __name__ == "__main__": 
    app.run(debug=True)
