import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields.", 400));
    }

    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const registerationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });
    if (registerationAttemptsByUser.length >= 5) {
      return next(
        new ErrorHandler(
          "You have exceeded the number of registration attempts. Please contact support.",
          400
        )
      );
    }

    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be between 8 and 16 characters.", 400)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      accountVerified: true,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "User login successfully.", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }
  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }
  if (
    newPassword.length < 8 ||
    newPassword.length > 16 ||
    confirmNewPassword.length < 8 ||
    confirmNewPassword.length > 16
  ) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters.", 400)
    );
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New password and confirm new password do not match.",
        400
      )
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated.",
  });
});
