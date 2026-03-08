const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { serializeUser } = require("../utils/serializers");

const JWT_SECRET = process.env.JWT_SECRET || "okai-dev-secret";

const signToken = (user) =>
  jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

const createUsernameFromName = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);

const ensureUniqueUsername = async (name) => {
  const base = createUsernameFromName(name) || `okai${Date.now()}`;
  let candidate = base;
  let attempt = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${base}${attempt}`;
    attempt += 1;
  }

  return candidate;
};

exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    name = name.trim();
    email = email.toLowerCase().trim();
    password = password.trim();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const username = await ensureUniqueUsername(name);
    const user = await User.create({ name, username, email, password });
    const token = signToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    email = email.toLowerCase().trim();
    password = password.trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);

    res.json({
      message: "Login successful",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
