// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== DATABASE ================== */
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/okai";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB fails
  });

/* ================== ROUTES ================== */
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const profileRoutes = require("./routes/profile"); // new protected profile route

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);

/* ================== ERROR HANDLER ================== */
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

/* ================== SERVER ================== */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Okai server running on port ${PORT}`)
);

/* ================== GLOBAL ERROR HANDLING ================== */
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
