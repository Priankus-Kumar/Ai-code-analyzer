export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = [], code = 'BAD_REQUEST') {
    return new AppError(message, 400, code, details);
  }

  static unauthorized(message = 'Unauthorized access', details = [], code = 'UNAUTHORIZED') {
    return new AppError(message, 401, code, details);
  }

  static forbidden(message = 'Forbidden action', details = [], code = 'FORBIDDEN') {
    return new AppError(message, 403, code, details);
  }

  static notFound(message = 'Resource not found', details = [], code = 'NOT_FOUND') {
    return new AppError(message, 404, code, details);
  }

  static conflict(message = 'Resource already exists', details = [], code = 'CONFLICT') {
    return new AppError(message, 409, code, details);
  }

  static unprocessable(message = 'Validation failed', details = [], code = 'VALIDATION_ERROR') {
    return new AppError(message, 422, code, details);
  }

  static tooManyRequests(message = 'Too many requests, please try again later', details = [], code = 'RATE_LIMITED') {
    return new AppError(message, 429, code, details);
  }
}
