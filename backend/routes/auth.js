const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.post("/profile", protect, updateProfile);

module.exports = router;
