const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateUser = require("../middleware/authMiddleware"); // Ensure middleware is used

// Route to fetch tax forms of the logged-in user
router.get("/taxforms", authenticateUser, async (req, res) => {
    try {
        // Use req.user._id instead of static ID
        const user = await User.findById(req.user._id);

        if (!user || !user.tax_forms) {
            return res.status(404).json({ message: "No tax forms found" });
        }

        res.json(user.tax_forms);
    } catch (error) {
        console.error("Error fetching tax forms:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
