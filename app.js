require("dotenv").config({
  path: "./config/config.env",
});
require("./config/database")();

const express = require("express");
const color = require("colors");
const path = require("path");

const router = require("./routers");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

// Router API
router(app);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`.rainbow);
});

// Handle UnhandledPromiseRejectionWarning
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  // Close server
  server.close(() => process.exit(1));
});
