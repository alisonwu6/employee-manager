const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "employee" }, // admin || employee
  gender: { type: String },
  phone: { type: String },
  address: { type: String },
  salary: { type: Number },
  position: { type: String },
  department: { type: String },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isAdmin = function() {
  return this.role === "admin";
};

module.exports = mongoose.model("User", userSchema);
