const express = require("express");
const {
  getLeaves,
  createLeave,
  approveLeave,
  rejectLeave
} = require("../controllers/leaveController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getLeaves);
router.post("/", protect, createLeave);
router.post("/:id/approve", protect, approveLeave);
router.post("/:id/reject", protect, rejectLeave);
module.exports = router;
