const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Schema
const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  country: String,
  maritalStatus: String,
  spouseName: String,
  childrenCount: String,
  address: String,
  passportNumber: String,
  companyName: String,
  phoneNumber: String,
  email: String,
  agentName: String,
  agentPhone: String,
  agentEmail: String,
  dateOfBirth: String,
  createdAt: { type: Date, default: Date.now }
});

// Create Model
const Profile = mongoose.model("Profile", profileSchema);

// POST Route to Save Profile Data
router.post("/", async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    await newProfile.save();
    res.status(201).json({ message: "Profile saved successfully!" });
  } catch (error) {
    console.error(error);  // Log error for debugging
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
