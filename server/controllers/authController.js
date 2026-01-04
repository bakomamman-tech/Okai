// server/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register new user
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase().trim();

    // Check if email or username already exists
    const exists = await User.findOne({ $or: [{ email }, { username: name.toLowerCase().replace(/\s+/g, "") }] });
    if (exists) {
      return res.status(400).json({ message: "Email or username already in use" });
    }

    // Generate username from name
    const username = name.toLowerCase().replace(/\s+/g, "");

    // Create new user (password hashing handled by User model pre-save hook)
    const user = new User({ name, username, email, password });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        cover: user.cover,
        bio: user.bio,
        role: user.role
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    email = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password using model method
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        cover: user.cover,
        bio: user.bio,
        role: user.role
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login failed" });
  }
};
