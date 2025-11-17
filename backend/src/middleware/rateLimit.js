const rateLimit = require('express-rate-limit');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const { getRedis } = require('../cache');

/**
 * Global rate limiter (Express middleware)
 */
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.GLOBAL_RATE_LIMIT || 10000),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Redis-based rate limiter for authenticated users
 */
class UserRateLimiter {
  constructor() {
    this.limiter = null;
  }

  async initialize() {
    const redis = getRedis();
    this.limiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'rate:user',
      points: parseInt(process.env.USER_RATE_LIMIT || 200), // requests
      duration: 86400, // per day
      blockDuration: 60, // block for 60 seconds if exceeded
    });
  }

  async checkLimit(userId) {
    if (!this.limiter) {
      await this.initialize();
    }

    try {
      await this.limiter.consume(userId);
      return { allowed: true };
    } catch (rejRes) {
      return {
        allowed: false,
        retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 60,
      };
    }
  }

  async middleware(req, res, next) {
    const userId = req.body?.user_id || req.query?.user_id;

    if (!userId) {
      return next(); // No user ID, skip user-specific rate limit
    }

    const result = await this.checkLimit(userId);

    if (!result.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: result.retryAfter,
      });
    }

    next();
  }
}

const userRateLimiter = new UserRateLimiter();

module.exports = {
  globalRateLimit,
  userRateLimiter,
};
