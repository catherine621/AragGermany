const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Grid = require("gridfs-stream");

const app = express();

// ✅ Apply CORS middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/libraryDB";
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize GridFS
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

// 📌 Download PDF Endpoint
app.get("/download_tax_form/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!gfs) {
      return res.status(500).json({ error: "GridFS not initialized" });
    }

    const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(fileId) });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

    const readStream = gfs.createReadStream({ _id: file._id });
    readStream.pipe(res);

  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = 5002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
