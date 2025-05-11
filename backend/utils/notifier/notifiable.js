class Notifiable {
  deliver(opts) {
    throw new Error('deliver() must be implemented by subclass');
  }
}

module.exports = Notifiable;