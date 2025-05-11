const Notifiable = require('./notifiable');

class EmailNotifier extends Notifiable {
  deliver({ from, to, body, options }) {
    console.log(`[EMAIL] notification from ${from} to ${to} with ${body}`)
  }
}