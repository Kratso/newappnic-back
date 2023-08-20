import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { CreateUserInput, LoginUserInput, ResetPasswordInput, ResetPasswordRequestInput } from '../schemas/user.schema';
import { createUser, findUser, signToken } from '../services/user.service';
import AppError from '../utils/appError';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail';

// Exclude this fields from the response
export const excludedFields = ['password'];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      phone: req.body.phone,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email already exist',
      });
    }
    next(err);
  }
};

export const resetPasswordRequestHandler = async (
  req: Request<{}, {}, ResetPasswordRequestInput>,
  res: Response,
  next: NextFunction
) => {

  try {
    const user =  await findUser({ email: req.body.email });

  if (!user) {
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
  sendEmail(user.email, "Reset Password Request", {name: user.name, link});

  return res.status(200).json({
      status: "success",
      message: "Password reset link sent successfully"
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
    const user =  await findUser({ email: req.body.email });

    if (!user) {
        throw new Error("User does not exist");
    }




    // Check if reset token is correct
    if (user.resetToken !== req.body.token) {
        throw new Error("Invalid reset token");
    }

    // Check if reset token is expired
    if (user.resetTokenExpires < Date.now()) {
        throw new Error("Reset token expired");
    }

    // Save the new password
    user.password = req.body.password;
    user.resetToken = '';
    user.resetTokenExpires = -1;
    await user.save();

    return res.status(200).json({
        status: "success",
        message: "Password reset successfully"
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
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Create an Access Token
    const { access_token } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie('accessToken', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

