import rateLimit from 'express-rate-limit';

// Global IP rate limiter: 100 requests per 15 minutes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests from this IP, please try again after 15 minutes.',
      details: [],
    },
  },
});

// User-specific advisory generation limiter: 10 requests per 10 minutes
export const advisoryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many advisory generation requests. Please wait a few minutes before trying again.',
      details: [],
    },
  },
});
