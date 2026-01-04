// server/controllers/userController.js
const User = require("../models/User");

/* ================== GET USER PROFILE ================== */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

/* ================== FOLLOW USER ================== */
exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === String(currentUserId)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: "Target user not found" });

    if (targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);

    await targetUser.save();
    await currentUser.save();

    res.json({
      message: "User followed successfully",
      user: {
        id: targetUser._id,
        name: targetUser.name,
        username: targetUser.username,
        avatar: targetUser.avatar,
        followers: targetUser.followers.length
      },
      currentUser: {
        id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        following: currentUser.following.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

/* ================== UNFOLLOW USER ================== */
exports.unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: "Target user not found" });

    if (!targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    targetUser.followers = targetUser.followers.filter(
      (id) => String(id) !== String(currentUserId)
    );
    currentUser.following = currentUser.following.filter(
      (id) => String(id) !== String(targetUserId)
    );

    await targetUser.save();
    await currentUser.save();

    res.json({
      message: "User unfollowed successfully",
      user: {
        id: targetUser._id,
        name: targetUser.name,
        username: targetUser.username,
        avatar: targetUser.avatar,
        followers: targetUser.followers.length
      },
      currentUser: {
        id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        following: currentUser.following.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};

/* ================== GET FOLLOWERS LIST ================== */
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("followers", "name username avatar")
      .select("followers");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      count: user.followers.length,
      followers: user.followers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch followers" });
  }
};

/* ================== GET FOLLOWING LIST ================== */
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("following", "name username avatar")
      .select("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      count: user.following.length,
      following: user.following
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch following list" });
  }
};
