const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/health", require("./routes/health"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/leaves", require("./routes/leave"));

// app.get("/test-error", (req, res) => {
//   throw new Error("testing errorHandlerMiddleware");
// });
app.use(errorHandlerMiddleware);

// Export the app object for testing
if (require.main === module) {
  connectDB();
  // If the file is run directly, start the server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
