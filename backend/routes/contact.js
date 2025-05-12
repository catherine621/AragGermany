const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  query: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Model
const Contact = mongoose.model("Contact", contactSchema);

// POST Route to Save Contact Form Data
router.post("/", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debug incoming request

    const { name, email, query } = req.body;
    if (!name || !email || !query) {
      console.log("❌ Missing fields:", req.body); // Debug
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, query });
    const savedContact = await newContact.save();
    
    console.log("✅ Data saved successfully:", savedContact); // Debug saved data
    res.status(201).json({ message: "Message sent successfully!", contact: savedContact });
  } catch (error) {
    console.error("❌ Database Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
