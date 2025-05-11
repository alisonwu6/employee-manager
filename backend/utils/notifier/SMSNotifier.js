const Notifiable = require('./notifiable');

class SMSNotifier extends Notifiable {
  deliver({ from, to, body, options }) {
    console.log(`[SMS] notification from ${from} to ${to} with ${body}`)
  }
}