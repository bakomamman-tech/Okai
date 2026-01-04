// server/controllers/postController.js
const Post = require("../models/Post");
const User = require("../models/User");

/* ================== CREATE POST ================== */
exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content && !image) {
      return res.status(400).json({ message: "Post must have content or image" });
    }

    const post = new Post({
      author: req.user._id,
      content,
      image,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

/* ================== GET ALL POSTS ================== */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username avatar")
      .populate("comments.user", "name username avatar")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

/* ================== GET SINGLE POST ================== */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "name username avatar")
      .populate("comments.user", "name username avatar");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

/* ================== LIKE POST ================== */
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Already liked this post" });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({ message: "Post liked successfully", likes: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like post" });
  }
};

/* ================== UNLIKE POST ================== */
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    post.likes = post.likes.filter((id) => String(id) !== String(req.user._id));
    await post.save();

    res.json({ message: "Post unliked successfully", likes: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unlike post" });
  }
};

/* ================== ADD COMMENT ================== */
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user._id, text, createdAt: new Date() });
    await post.save();

    res.json({ message: "Comment added successfully", comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* ================== GET USER FEED ================== */
exports.getUserFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("following");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: { $in: user.following } })
      .populate("author", "name username avatar")
      .populate("comments.user", "name username avatar")
      .sort({ createdAt: -1 });

    res.json({ feed: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feed" });
  }
};

/* ================== DELETE POST ================== */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
