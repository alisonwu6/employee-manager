const Logger = require("../utils/Logger");

module.exports = (err, req, res, next) => { 
  Logger.log("errorHandlerMiddleware", req.method, err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
