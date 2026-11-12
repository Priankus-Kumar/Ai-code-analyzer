import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Extract token from httpOnly cookie or Authorization Bearer header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401, 'UNAUTHORIZED'));
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401, 'USER_NOT_FOUND')
      );
    }

    if (!currentUser.isActive) {
      return next(new AppError('This account has been deactivated.', 403, 'ACCOUNT_INACTIVE'));
    }

    // 4. Grant access: attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired! Please log in again.', 401, 'TOKEN_EXPIRED'));
    }
    return next(error);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
    }
    next();
  };
};
