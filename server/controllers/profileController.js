const User = require("../models/User");
const { serializeUser } = require("../utils/serializers");

const allowedFields = ["name", "bio", "headline", "location", "website", "avatar", "cover"];

exports.getMyProfile = async (req, res) => {
  res.json({
    user: serializeUser(req.user),
  });
};

exports.updateMyProfile = async (req, res) => {
  try {
    const updates = {};

    allowedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        updates[field] = req.body[field].trim();
      }
    });

    if (updates.name && updates.name.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long" });
    }

    if (updates.website && !/^https?:\/\//i.test(updates.website)) {
      updates.website = `https://${updates.website}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
