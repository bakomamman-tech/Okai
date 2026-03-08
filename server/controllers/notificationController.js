const Notification = require("../models/Notification");
const { normalizeId, serializeNotification } = require("../utils/serializers");

const userProjection =
  "name username avatar bio headline location website cover role followers following";

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate("actorId", userProjection)
      .sort({ createdAt: -1 });

    res.json({
      notifications: notifications.map((notification) => serializeNotification(notification)),
      unreadCount: notifications.filter((notification) => !notification.read).length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId).populate(
      "actorId",
      userProjection
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (normalizeId(notification.userId) !== normalizeId(req.user._id)) {
      return res.status(403).json({ message: "You cannot update this notification" });
    }

    notification.read = true;
    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification: serializeNotification(notification),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};
