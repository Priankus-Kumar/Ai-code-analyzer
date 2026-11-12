import {
  registerUser,
  authenticateUser,
  setAuthCookie,
  clearAuthCookie
} from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await registerUser({ name, email, password });

  setAuthCookie(res, token);

  res.status(201).json({
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authenticateUser({ email, password });

  setAuthCookie(res, token);

  res.status(200).json({
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      }
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({
    data: {
      message: 'Logged out successfully'
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        lastLoginAt: req.user.lastLoginAt,
        createdAt: req.user.createdAt
      }
    }
  });
});
