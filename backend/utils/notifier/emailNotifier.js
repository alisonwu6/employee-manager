const Notifiable = require('./Notifiable');

class EmailNotifier extends Notifiable {
  deliver({ from, to, body, options }) {
    console.log(`[EMAIL] notification from ${from} to ${to} with ${body}`)
  }
}

module.exports = { EmailNotifier };