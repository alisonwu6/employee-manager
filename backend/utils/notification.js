const NotificationModel = require("../models/Notification");

async function sendNotification(recipient, sender, message, options = {}) {
  if (!recipient || !sender) {
    return Promise.reject(new Error("Recipient and sender are required"));
  }

  if (!message) {
    return Promise.reject(new Error("Message is required"));
  }

  const notificationObject = {
    recipient: recipient,
    sender: sender,
    message: message,
    createdAt: new Date(),
    link: options.link || null,
    read: false
  };
  const newNotification = await NotificationModel.create(notificationObject);

  if (newNotification) {
    return Promise.resolve(newNotification);
  } else {
    return Promise.reject(new Error("Failed to create notification"));
  }
}

module.exports = {
  sendNotification
};
