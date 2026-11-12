import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.code = err.code || 'INTERNAL_SERVER_ERROR';
  error.details = err.details || [];

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error = AppError.notFound(`Resource not found with id ${err.value}`);
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = AppError.conflict(
      `An account or resource with this ${field} already exists.`,
      [{ field, message: `${field} must be unique` }],
      'DUPLICATE_ENTRY'
    );
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
    error = AppError.unprocessable('Database validation failed', details);
  }

  // JSON Body Parser Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = AppError.badRequest('Malformed JSON in request body', [], 'INVALID_JSON');
  }

  // Log error (never log secrets or full source code)
  logger.error(`${req.method} ${req.originalUrl} - ${error.statusCode}: ${error.message}`, {
    requestId: req.id,
    code: error.code,
    statusCode: error.statusCode
  });

  // Prepare standard response envelope
  const responsePayload = {
    error: {
      code: error.code,
      message: error.isOperational ? error.message : 'An unexpected error occurred. Please try again.',
      details: error.details
    }
  };

  // Stack trace only in development
  if (env.NODE_ENV === 'development' && !error.isOperational) {
    responsePayload.error.stack = err.stack;
  }

  res.status(error.statusCode).json(responsePayload);
};
