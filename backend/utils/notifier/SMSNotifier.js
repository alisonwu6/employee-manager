const Notifiable = require('./Notifiable');

class SMSNotifier extends Notifiable {
  deliver({ from, to, body, options }) {
    console.log(`[SMS] notification from ${from} to ${to} with ${body}`)
  }
}

module.exports = { SMSNotifier };