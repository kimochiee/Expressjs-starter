const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/customError");
const {
  createAcessToken,
  createRefreshToken,
  verifyToken,
} = require("../utils/jwt");

const userService = require("../services/user.service");

const signup = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password != confirmPassword) {
    throw new CustomError("Password must be the same", 400);
  }

  const userData = { username, email, password };

  const result = await userService.addUser(userData);

  res.status(201).json(result);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userService.findUserWithConditions({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new CustomError("Email or password is incorrect", 400);
  }

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
    .json({ status: "success", msg: "Login success", accessToken, user });
});

const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new CustomError("You already logout", 400);
  }

  const user = await userService.findUserWithConditions({
    refreshToken,
  });

  if (!user) {
    throw new CustomError("Invalid refresh token", 401);
  }

  user.refreshToken = undefined;
  await user.save();

  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    .status(200)
    .json({
      status: "success",
      msg: "Logout successfully",
    });
});

const renewToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new CustomError("You already logout", 400);
  }

  const payload = verifyToken(refreshToken);

  const user = await userService.findUserWithConditions({
    _id: payload._id,
    refreshToken,
  });

  if (!user) {
    throw new CustomError("Invalid refresh token", 401);
  }

  const accessToken = createAcessToken(user._id, user.role);

  res.status(200).json({
    status: "success",
    message: "Renew access token successfully",
    accessToken,
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError("Missing email", 400);
  }

  const user = await userService.findUserWithConditions({ email });

  if (!user) {
    throw new CustomError("No user with that email", 400);
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordURl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset_password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetPasswordURl} \nIf you didn't forget your password please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res
      .status(200)
      .json({ status: "success", msg: "resetPasswordToken sent to email" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new CustomError("There was an error while sending the email", 500);
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetPasswordToken)
    .digest("hex");

  const user = await userService.findUserWithConditions({
    resetPasswordToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("Token is invalid or expired", 400);
  }

  const { password } = req.body;

  if (!password) {
    throw new CustomError("Missing password", 404);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangeAt = Date.now();
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
      msg: "Reset password successfully",
      accessToken,
      user,
    });
});

module.exports = {
  signup,
  login,
  logout,
  renewToken,
  forgotPassword,
  resetPassword,
};
