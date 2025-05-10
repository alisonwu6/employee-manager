const fs = require("fs");

class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this;
    }
    return Logger.instance;
  }

  log(method, api, message) {
    const logMessage = `${new Date().toISOString()} - Log : [${method} | ${api}] - Message: ${message}\n`;
    console.log(logMessage);

    fs.appendFile("app.log", logMessage, (err) => {
      if (err) {
        console.error("Log failed", err);
      }
    });
  }

  error(method, api, message) {
    const logMessage = `${new Date().toISOString()} - Error : [${method} | ${api}] - Message: ${message}\n`;
    console.log(logMessage);

    fs.appendFile("app.log", logMessage, (err) => {
      if (err) {
        console.error("Error failed", err);
      }
    });
  }
}

const instance = new Logger();
Object.freeze(instance);

module.exports = instance;
