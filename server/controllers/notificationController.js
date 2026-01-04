// server/controllers/notificationController.js
const Notification = require("../models/Notification");

// Get notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({ userId })
      .populate("actorId", "name username avatar")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (e) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};
