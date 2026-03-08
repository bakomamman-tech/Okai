require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadsDir));

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/okai";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });

const safeLoad = (modulePath) => {
  try {
    const routeModule = require(modulePath);

    if (!routeModule || typeof routeModule !== "function") {
      throw new Error("Not an Express Router");
    }

    return routeModule;
  } catch (error) {
    console.error(`Failed to load ${modulePath}:`, error.message);
    return null;
  }
};

const authRoutes = safeLoad("./routes/auth");
const userRoutes = safeLoad("./routes/users");
const postRoutes = safeLoad("./routes/posts");
const profileRoutes = safeLoad("./routes/profile");
const storyRoutes = safeLoad("./routes/stories");
const notificationRoutes = safeLoad("./routes/notifications");

if (authRoutes) app.use("/api/auth", authRoutes);
if (userRoutes) app.use("/api/users", userRoutes);
if (postRoutes) app.use("/api/posts", postRoutes);
if (profileRoutes) app.use("/api/profile", profileRoutes);
if (storyRoutes) app.use("/api/stories", storyRoutes);
if (notificationRoutes) app.use("/api/notifications", notificationRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", service: "Okai API" });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Okai server running on port ${port}`);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error.message);
  server.close(() => process.exit(1));
});
