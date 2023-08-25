import config from "config";
import { CookieOptions, NextFunction, Request, Response } from "express";
import {
  CreateUserInput,
  LoginUserInput,
  ResetPasswordInput,
  ResetPasswordRequestInput,
} from "../schemas/user.schema";
import { createUser, findUser, signToken } from "../services/user.service";
import AppError from "../utils/appError";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail";
import { discordService } from "../services/discord.service";

// Exclude this fields from the response
export const excludedFields = ["password"];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production
if (process.env.NODE_ENV === "production")
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    discordService.log(
      `Register User: Attempting to register ${req.body.email} as a user`
    );
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      phone: req.body.phone,
    });
    discordService.log(
      `Register User: ${req.body.email} registered successfully`
    );
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      discordService.log(`Register User: ${req.body.email} already exist`);
      return res.status(409).json({
        status: "fail",
        message: "Email already exist",
      });
    }
    discordService.log(`Register User: ${req.body.email} failed to register`);
    next(err);
  }
};

export const resetPasswordRequestHandler = async (
  req: Request<{}, {}, ResetPasswordRequestInput>,
  res: Response,
  next: NextFunction
) => {
  discordService.log(
    `Reset Password Request: Attempting to reset password for ${req.body.email}`
  );
  try {
    const user = await findUser({ email: req.body.email });

    if (!user) {
      discordService.log(
        `Reset Password Request: ${req.body.email} does not exist`
      );
      throw new Error("User does not exist");
    }

    // Create a Password Reset Token
    let resetToken = crypto.randomBytes(32).toString("hex");

    // Save the reset token and expiry date
    user.resetToken = resetToken;

    // Expire the token after 20 minutes
    user.resetTokenExpires = Date.now() + 20 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const link = `travel.pibardos.club/reset-password/${user.email}/${resetToken}`;

    // Send Email
    sendEmail(user.email, "Reset Password Request", { name: user.name, link });
    discordService.log(`Reset Password Request: Reset link sent to ${user.email}`)
    return res.status(200).json({
      status: "success",
      message: "Password reset link sent successfully",
    });
  } catch (err: any) {
    next(err);
  }
};

export const resetPasswordHandler = async (
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    discordService.log(`Reset Password: Attempting to reset password for ${req.body.email}`)
    const user = await findUser({ email: req.body.email });

    if (!user) {
      discordService.log(`Reset Password: ${req.body.email} does not exist`)
      throw new Error("User does not exist");
    }

    // Check if reset token is correct
    if (user.resetToken !== req.body.token) {
      discordService.log(`Reset Password: Invalid reset token`)
      throw new Error("Invalid reset token");
    }

    // Check if reset token is expired
    if (user.resetTokenExpires < Date.now()) {
      discordService.log(`Reset Password: Reset token expired`)
      throw new Error("Reset token expired");
    }

    // Save the new password
    user.password = req.body.password;
    user.resetToken = "";
    user.resetTokenExpires = -1;
    await user.save();
    discordService.log(`Reset Password: Password reset successfully for ${req.body.email}`)
    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err: any) {
    next(err);
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    discordService.log(`Login: Attempting to login ${req.body.email}`)
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      discordService.log(`Login: Invalid email or password`)
      return next(new AppError("Invalid email or password", 401));
    }

    // Create an Access Token
    const { access_token } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie("accessToken", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    discordService.log(`Login: ${req.body.email} logged in successfully`)
    // Send Access Token
    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};
