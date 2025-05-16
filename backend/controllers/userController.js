const User = require("../models/User");
const Logger = require("../utils/Logger");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    Logger.log("profile", "get", `UserId: ${req.user.id}`);
    if (!user) {
      Logger.error("profile", "get", `UserId: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    Logger.log("profile", "get", `UserId: ${req.user.id}`);
    res.status(200).json({
      name: user.name,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      email: user.email,
      salary: user.salary,
      position: user.position,
      department: user.department,
    });
  } catch (error) {
    Logger.error("profile", "get", `Internal server error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    Logger.log("profile", "post", `UserId: ${req.user.id}`);
    if (!user) {
      Logger.error("profile", "post", `UserId: ${req.user.id}, User not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const { gender, phone, address } = req.body;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();
    res.json({ message: "Profile updated successfully" });
    Logger.log("profile", "post", `UserId: ${req.user.id}'s profile`);
  } catch (error) {
    Logger.error("profile", "post", `Internal server error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
