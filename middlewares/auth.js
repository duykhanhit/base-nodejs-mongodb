const User = require("../models/User");
const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const jwt = require("jsonwebtoken");

module.exports = {
  protect: asyncHandle(async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bear")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ErrorResponse(401, "Token is invalid."));
    }

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      return next(new ErrorResponse(401, "Not authorize to access."));
    }
  }),
  authorize: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            403,
            `User with role ${req.user.role} is not authorized to access.`
          )
        );
      }
      next();
    };
  },
};
