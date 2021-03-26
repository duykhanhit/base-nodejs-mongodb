const User = require("../models/User");
const asyncHandle = require("../middlewares/asyncHandle");
const ErrorResponse = require("../helpers/ErrorResponse");

module.exports = {
  // @desc    Get all user
  // @route   GET   /api/users
  // @access  private/admin
  getUsers: asyncHandle(async (req, res, next) => {
    res.status(200).json(res.advanceResults);
  }),

  // @desc    Get single user
  // @route   GET   /api/users/:id
  // @access  private/admin
  getUser: asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorResponse(404, `Cannot find user with id ${id}`));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // @desc    Create user
  // @route   POST   /api/users
  // @access  private/admin
  createUser: asyncHandle(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // @desc    Update user
  // @route   PUT   /api/users/:id
  // @access  private/admin
  updateUser: asyncHandle(async (req, res, next) => {
    const { id } = req.body;

    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new ErrorResponse(404, `Cannot find user with id ${id}`));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // @desc    Delete user
  // @route   DELETE   /api/users/:id
  // @access  private/admin
  deleteUser: asyncHandle(async (req, res, next) => {
    const { id } = req.body;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(new ErrorResponse(404, `Cannot find user with id ${id}`));
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  }),
};
