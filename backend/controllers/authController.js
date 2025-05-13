const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Logger = require("../utils/Logger");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res) => {
  const { token, password, email } = req.body;
  Logger.log("register", "post", `register: ${email}`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      Logger.error(
        "register",
        "post",
        `User not found for token email: ${email}`
      );
      return res.status(404).json({ message: "User not found" });
    }

    if (user.active) {
      Logger.error("register", "post", `User already activated: ${email}`);
      return res.status(400).json({ message: "Account already registered" });
    }

    user.password = password;
    user.active = true;
    await user.save();
    res.status(201).json({
      message: "Account registered successfully",
    });

  } catch (err) {
    Logger.error(
      "register",
      "post",
      `Invalid or expired token: ${err.message}`
    );
    return res.status(401).json({ message: "Invalid or expired token" });
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
        isAdmin: user.isAdmin()
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

module.exports = { register, login };
