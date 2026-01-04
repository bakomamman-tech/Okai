// server/routes/notifications.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getNotifications, markAsRead } = require("../controllers/notificationController");

// Get all notifications
router.get("/", authMiddleware, getNotifications);

// Mark notification as read
router.put("/:notificationId/read", authMiddleware, markAsRead);

module.exports = router;
