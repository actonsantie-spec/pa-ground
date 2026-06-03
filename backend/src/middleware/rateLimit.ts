import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({ windowMs: 1000 * 10, max: 20 });
