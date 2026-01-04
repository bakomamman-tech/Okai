// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 3, 
    maxlength: 30 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  avatar: { type: String, default: "/uploads/default.png" },
  cover: { type: String, default: "/uploads/cover-default.jpg" },
  bio: { type: String, default: "", maxlength: 160 },
  joined: { type: Date, default: Date.now },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  role: { type: String, enum: ["user", "admin"], default: "user" }
});

// Indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Pre-save hook to hash password
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password during login
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtuals for follower/following counts
UserSchema.virtual("followerCount").get(function() {
  return this.followers.length;
});
UserSchema.virtual("followingCount").get(function() {
  return this.following.length;
});

module.exports = mongoose.model("User", UserSchema);
