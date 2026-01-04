// server/routes/profile.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// GET logged-in user's profile
router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user
  });
});

module.exports = router;
