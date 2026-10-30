import { errorResponse } from '../utils/responseFormatter.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', {
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred';
  const errors = err.errors || null;

  return errorResponse(res, message, statusCode, errors);
};
