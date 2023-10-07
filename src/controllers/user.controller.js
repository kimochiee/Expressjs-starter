const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/customError");
const { createAcessToken, createRefreshToken } = require("../utils/jwt");
const filterObj = require("../utils/filterObj");

const userService = require("../services/user.service");

//user
const getCurrentUser = catchAsync(async (req, res, next) => {
  const user = await userService.findUserById(req.user._id);

  if (!user) {
    throw new CustomError("Invalid access token", 404);
  }

  res
    .status(200)
    .json({ status: "success", msg: "Get current user successfully", user });
});

const updateMe = catchAsync(async (req, res, next) => {
  const data = filterObj(req.body, "avatar");

  const user = await userService.updateUserById(req.user._id, data);

  res
    .status(200)
    .json({ status: "success", msg: "Update your profile successfully", user });
});

const uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    throw new CustomError("Missing file", 400);
  }

  const data = { avatar: req.file.path };

  const user = await userService.updateUserAvatar(req.user._id, data);

  res
    .status(200)
    .json({ status: "success", msg: "Upload avatar successfully", user });
});

const updateMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  if (!currentPassword || !password || !passwordConfirm) {
    throw new CustomError("Missing inputs", 400);
  }

  const user = await userService.findUserById(req.user._id);

  if (!(await user.comparePassword(currentPassword))) {
    throw new CustomError("Your current password is wrong", 400);
  }

  if (password != passwordConfirm) {
    throw new CustomError("Password must be the same", 400);
  }

  user.password = password;
  const accessToken = createAcessToken(user._id, user.role);
  const refreshToken = createRefreshToken(user._id);
  user.refreshToken = refreshToken;

  await user.save();

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    .status(200)
    .json({
      status: "success",
      msg: "Update password successfully",
      accessToken,
      user,
    });
});

//admin
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.findAllUsersWithConditions(req.query);

  res
    .status(200)
    .json({ status: "success", msg: "Get all users successfully", users });
});

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    throw new CustomError("Missing inputs", 400);
  }

  const userData = { username, email, password, role };

  const user = await userService.addUser(userData);

  res
    .status(201)
    .json({ status: "success", msg: "Create user successfully", user });
});

const getSingleUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await userService.findUserById(userId);

  if (!user) {
    throw new CustomError("No user with that id", 404);
  }

  res
    .status(200)
    .json({ status: "success", msg: "Get user successfully", user });
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await userService.updateUserById(userId, req.body);

  if (!user) {
    throw new CustomError("No user with that id", 404);
  }

  res
    .status(200)
    .json({ status: "success", msg: "Update user successfully", user });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await userService.deleteUserById(userId);

  if (!user) {
    throw new CustomError("No user with that id", 404);
  }

  res
    .status(200)
    .json({ status: "success", msg: "Delete user successfully", user });
});

module.exports = {
  getCurrentUser,
  updateMe,
  uploadAvatar,
  updateMyPassword,
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
