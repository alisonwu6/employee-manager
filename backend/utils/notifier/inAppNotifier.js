const Notifiable = require('./Notifiable');
const NotificationModel = require("../../models/Notification");

class InAppNotifier extends Notifiable {
  async deliver({ from, to, body, options }) {
    if (!to || !from) {
      return Promise.reject(new Error("Recipient and sender are required"));
    }
  
    if (!body) {
      return Promise.reject(new Error("Message is required"));
    }
  
    const notificationObject = {
      recipient: to,
      sender: from,
      message: body,
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
}

module.exports = { InAppNotifier };