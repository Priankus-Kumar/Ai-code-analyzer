import { AppError } from '../utils/AppError.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return next(new AppError('Validation failed', 422, 'VALIDATION_ERROR', details));
      }
      next(err);
    }
  };
};
