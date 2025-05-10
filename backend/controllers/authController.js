const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Logger = require("../utils/Logger");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  Logger.log("register", "post", `register: ${email}`);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      Logger.error("register", "post", `Email already exists: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
    Logger.log("register", "post", `Registered new user: ${email}`);
  } catch (error) {
    Logger.error("register", "post", `Internal server error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  Logger.log("login", "post", `login attempt: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      Logger.log("login", "post", `logged in: ${email}`);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      Logger.error("login", "post", `Invalid email or password: ${email}`);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    Logger.error("login", "post", `Internal server error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

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

    const { name, gender, phone, address } = req.body;
    user.name = name || user.name;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      gender: updatedUser.gender,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
    Logger.log("profile", "post", `UserId: ${req.user.id}'s profile`);
  } catch (error) {
    Logger.error("profile", "post", `Internal server error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
