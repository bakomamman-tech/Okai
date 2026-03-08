const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile } = require("../controllers/profileController");

const router = express.Router();

router.get("/", authMiddleware, getMyProfile);
router.put("/", authMiddleware, updateMyProfile);

module.exports = router;
