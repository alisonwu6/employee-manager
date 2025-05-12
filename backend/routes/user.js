const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getProfile);
router.post("/profile", protect, updateProfile);

module.exports = router;
