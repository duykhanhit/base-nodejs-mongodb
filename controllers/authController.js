const User = require("../models/User");
const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const sendTokenResponse = require("../helpers/sendTokenResponse");
const sendMail = require("../helpers/sendMail");
const crypto = require("crypto");

module.exports = {
  // @desc    Register new user
  // @route   POST   /api/auth/register
  // @access  public
  register: asyncHandle(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    sendTokenResponse(user, 201, res);
  }),

  // @desc    Login
  // @route   POST   /api/auth/login
  // @access  public
  login: asyncHandle(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse(400, "Email or password is invalid."));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse(400, "User is not exists."));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse(400, "Wrong password."));
    }

    sendTokenResponse(user, 201, res);
  }),

  // @desc    Get current user
  // @route   GET   /api/auth/me
  // @access  private
  getMe: asyncHandle(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // @desc    Update user details
  // @route   PUT   /api/auth/update-details
  // @access  private
  updateDetails: asyncHandle(async (req, res, next) => {
    const fieldsUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // @desc    Update password
  // @route   PUT   /api/auth/update-password
  // @access  private
  updatePassword: asyncHandle(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.matchPassword(req.body.currentPassword);

    if (!isMatch) {
      return next(new ErrorResponse(401, "Password is not correct."));
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      return next(new ErrorResponse(401, `New password is invalid.`));
    }

    user.password = newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);
  }),

  // @desc    Reset password
  // @route   PUT   /api/auth/reset-password/:resetToken
  // @access  private
  resetPassword: asyncHandle(async (req, res, next) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse(401, "Reset token is invalid."));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  }),

  // @desc    Forgot password
  // @route   POST   /api/auth/forgot
  // @access  public
  forgotPassword: asyncHandle(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ErrorResponse(404, `There is no user with email ${email}`)
      );
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({
      validateBeforeSave: false,
    });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    const message = `
    Vui lòng click vào đây ${resetUrl} để cập nhật lại mật khẩu.
    Link tồn tại trong 10 phút.
    `;

    try {
      await sendMail({
        email: email,
        subject: "Quên mật khẩu?",
        message,
      });

      res.status(200).json({
        success: true,
        data: "Email sent.",
      });
    } catch (err) {
      console.log(`Error send mail: ${err.message}`);
      res.status(400).json({
        success: false,
        data: err.message,
      });
    }

    res.status(200).json({
      success: true,
      resetUrl,
    });
  }),
};
