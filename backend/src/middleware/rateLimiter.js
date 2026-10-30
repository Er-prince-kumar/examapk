import rateLimit from 'express-rate-limit';

// Standard API rate limiter: 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    timestamp: new Date().toISOString()
  }
});

// Stricter rate limiter for AI operations: 20 requests per 5 minutes
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a few moments before requesting more suggestions.',
    timestamp: new Date().toISOString()
  }
});
