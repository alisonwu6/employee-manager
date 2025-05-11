const User = require("../models/User");
const Notification = require("../models/Notification");
const NotifierFacade = require("../utils/notifier/notifierFacade");
const notifier = new NotifierFacade();

function getUser(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .then((user) => {
        if (!user) {
          reject(new Error("User not found"));
        } else {
          resolve(user);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const getNotifications = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 })
      .populate("sender", "name");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const readMessage = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if(!notification.read) {
      notification.read = true;
      await notification.save();
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const createNotification = async (req, res) => {
  try {
    const { message, link, recipient } = req.body;
    const user = await getUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    notifier.notify({
      from: user._id,
      to: recipient,
      body: message,
      options: { link: link }
    });
    
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { getNotifications, readMessage, createNotification };
