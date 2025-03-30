const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified; // Attach user ID to request
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// Get user ID from token
router.get("/get_user_id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Fetch user from DB
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user_id: user._id });
    } catch (error) {
        console.error("Error fetching user ID:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
