import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const standardResponse = (message = 'Too many requests, please try again later.') => ({
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message,
    details: []
  }
});

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.NODE_ENV === 'test' ? 10000 : env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse('Too many requests from this IP, please try again after 15 minutes.'),
  skip: () => env.NODE_ENV === 'test'
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'test' ? 10000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse('Too many authentication attempts. Please try again after 15 minutes.'),
  skip: () => env.NODE_ENV === 'test'
});

export const analysisLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.NODE_ENV === 'test' ? 10000 : env.ANALYSIS_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse('Analysis rate limit exceeded. Please wait before submitting more code.'),
  skip: () => env.NODE_ENV === 'test'
});
