const Notification = require("../models/Notification");
const User = require("../models/User");
const { normalizeId, serializeUser } = require("../utils/serializers");

const isSameId = (left, right) => normalizeId(left) === normalizeId(right);

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: serializeUser(user, {
        isCurrentUser: isSameId(user._id, req.user._id),
        isFollowing: Array.isArray(user.followers)
          ? user.followers.some((id) => isSameId(id, req.user._id))
          : false,
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (isSameId(targetUserId, currentUserId)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.followers.some((id) => isSameId(id, currentUserId))) {
      return res.status(400).json({ message: "Already following this user" });
    }

    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);

    await targetUser.save();
    await currentUser.save();

    await Notification.create({
      userId: targetUser._id,
      type: "follow",
      actorId: currentUser._id,
      entityId: currentUser._id,
    });

    res.json({
      message: "User followed successfully",
      user: serializeUser(targetUser, { isFollowing: true }),
      currentUser: serializeUser(currentUser),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!targetUser.followers.some((id) => isSameId(id, currentUserId))) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    targetUser.followers = targetUser.followers.filter((id) => !isSameId(id, currentUserId));
    currentUser.following = currentUser.following.filter((id) => !isSameId(id, targetUserId));

    await targetUser.save();
    await currentUser.save();

    res.json({
      message: "User unfollowed successfully",
      user: serializeUser(targetUser, { isFollowing: false }),
      currentUser: serializeUser(currentUser),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("followers", "name username avatar bio headline location website cover role followers following")
      .select("followers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      count: user.followers.length,
      followers: user.followers.map((follower) => serializeUser(follower)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch followers" });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("following", "name username avatar bio headline location website cover role followers following")
      .select("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      count: user.following.length,
      following: user.following.map((followedUser) => serializeUser(followedUser)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch following list" });
  }
};
