const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  applier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  leaveType: { type: String, required: true },
  reason: { type: String, required: true },
  selectedDate: { type: Date, required: true },
  status: { type: String, required: true, default: "pending" },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

leaveSchema.pre("save", async function (next) {
  // Check for existing leaves on the same date
  const existingLeave = await this.constructor.findOne({
    applier: this.applier,
    selectedDate: this.selectedDate,
    _id: { $ne: this._id }
  });

  console.log(this.selectedDate, this.applier);

  if (existingLeave) {
    throw new Error('You already have a leave request for this date');
  }

  // Ensure selected date is not in the past
  if (this.selectedDate < new Date().setHours(0,0,0,0)) {
    throw new Error('Cannot request leave for past dates');
  }
});

module.exports = mongoose.model("Leave", leaveSchema);
