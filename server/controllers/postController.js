const Notification = require("../models/Notification");
const Post = require("../models/Post");
const { normalizeId, serializePost } = require("../utils/serializers");

const userProjection =
  "name username avatar bio headline location website cover role followers following";

exports.createPost = async (req, res) => {
  try {
    const content = req.body.content ? req.body.content.trim() : "";
    const image = req.body.image ? req.body.image.trim() : "";

    if (!content && !image) {
      return res.status(400).json({ message: "Post must have content or image" });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      image,
    });

    await post.populate("author", userProjection);

    res.status(201).json({
      message: "Post created successfully",
      post: serializePost(post, req.user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", userProjection)
      .populate("comments.user", userProjection)
      .sort({ createdAt: -1 });

    res.json({
      posts: posts.map((post) => serializePost(post, req.user._id)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", userProjection)
      .populate("comments.user", userProjection);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;
    const hasLiked = post.likes.some((id) => normalizeId(id) === normalizeId(userId));

    if (hasLiked) {
      post.likes = post.likes.filter((id) => normalizeId(id) !== normalizeId(userId));
    } else {
      post.likes.push(userId);

      if (normalizeId(post.author) !== normalizeId(userId)) {
        await Notification.create({
          userId: post.author._id,
          type: "like",
          actorId: userId,
          entityId: post._id,
        });
      }
    }

    await post.save();

    res.json({
      message: hasLiked ? "Post unliked successfully" : "Post liked successfully",
      post: serializePost(post, userId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const text = req.body.text ? req.body.text.trim() : "";

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findById(req.params.postId)
      .populate("author", userProjection)
      .populate("comments.user", userProjection);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date(),
    });

    await post.save();
    await post.populate("comments.user", userProjection);

    if (normalizeId(post.author) !== normalizeId(req.user._id)) {
      await Notification.create({
        userId: post.author._id,
        type: "comment",
        actorId: req.user._id,
        entityId: post._id,
      });
    }

    res.json({
      message: "Comment added successfully",
      post: serializePost(post, req.user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};
