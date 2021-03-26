const errorHandle = require("../middlewares/errorHandle");

const userRouter = require("./userRouter");
const authRouter = require("./authRouter");

module.exports = (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);

  // Middleware handle error
  app.use(errorHandle);
};
