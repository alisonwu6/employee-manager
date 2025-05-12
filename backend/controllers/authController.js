const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Logger = require("../utils/Logger");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res) => {
  const { token, password } = req.body;
  Logger.log("register", "post", `register: ${email}`);

  try {
    // const userExists = await User.findOne({ email });
    // if (userExists) {
    //   Logger.error("register", "post", `Email already exists: ${email}`);
    //   return res.status(400).json({ message: "User already exists" });
    // }

    // const user = await User.create({ name, email, password });
    // TODO
    // backend/employee: adding new employee -> encode info -> send email 
    // Employee adds field account status: inactive || active

    // TODO
    // check if token expired?
    // check register status and update to User
    // update password to User

    // res.status(201).json({
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   token: generateToken(user.id),
    // });

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
