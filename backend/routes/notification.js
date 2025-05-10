const express = require("express");
const {
  getNotifications,
  readMessage,
  createNotification
} = require("../controllers/notificationController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.post("/:id/read", protect, readMessage)
router.post("/", protect, createNotification);
module.exports = router;
