import { errorResponse } from '../utils/responseFormatter.js';

/**
 * Middleware factory to validate request body, query or params using Zod
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const errorDetails = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return errorResponse(res, 'Validation failed', 400, errorDetails);
      }
      return errorResponse(res, 'Invalid request data', 400);
    }
  };
};
