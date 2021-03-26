const ErrorResponse = require("../helpers/ErrorResponse");

const errorHandle = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(`Error handle: ${err.stack}`.bold);

  // MongoDB bad ObjectID
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(404, message);
  }

  // MongoDB duplicate value
  if (err.code === 11000) {
    const message = "Duplicate value";
    error = new ErrorResponse(400, message);
  }

  // MongoDB validation failed
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((error) => error.message);
    error = new ErrorResponse(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    data: error.message || "Server error",
  });
};

module.exports = errorHandle;
