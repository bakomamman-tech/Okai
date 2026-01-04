// server/models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // recipient
  type: { type: String, enum: ["like", "comment", "follow"], required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who triggered it
  entityId: { type: mongoose.Schema.Types.ObjectId }, // postId or userId
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);
