import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export const getCookieOptions = () => {
  const isProd = env.isProduction;
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  };
};

export const setAuthCookie = (res, token) => {
  res.cookie('token', token, getCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.cookie('token', '', {
    ...getCookieOptions(),
    maxAge: 0
  });
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw AppError.conflict('An account with this email address already exists.', [
      { field: 'email', message: 'Email is already registered' }
    ]);
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Security requirement: explicitly ignore client-supplied role, isActive, or id
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'user',
    isActive: true,
    lastLoginAt: new Date()
  });

  const token = generateToken(user._id);

  return { user, token };
};

export const authenticateUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  if (!user.isActive) {
    throw AppError.forbidden('This account has been deactivated. Please contact support.');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  return { user, token };
};
