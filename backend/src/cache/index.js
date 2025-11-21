const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis;

async function setupRedis() {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL not configured');
  }
  
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError(err) {
      logger.error('Redis reconnect error:', err);
      return true;
    },
  });

  redis.on('error', (err) => {
    logger.error('Redis error:', err);
  });

  redis.on('connect', () => {
    logger.info('Redis connected');
  });

  // Test connection
  await redis.ping();

  return redis;
}

function getRedis() {
  if (!redis) {
    throw new Error('Redis not initialized. Call setupRedis first.');
  }
  return redis;
}

// Normalize topic for cache key
function normalizeTopic(topic) {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

// Cache keys
const KEYS = {
  hot: (topic) => `hot:${normalizeTopic(topic)}`,
  rateGlobal: () => 'rate:global',
  rateUser: (userId) => `rate:user:${userId}`,
  modelCounter: (model) => `model:counter:${model}`,
};

// Cache explanation
async function cacheExplanation(topic, content, ttl = null) {
  if (!redis) return;
  const key = KEYS.hot(topic);
  const defaultTTL = content.verified 
    ? parseInt(process.env.CACHE_TTL_VERIFIED || 15552000)
    : parseInt(process.env.CACHE_TTL_NORMAL || 604800);
  
  try {
    await redis.setex(key, ttl || defaultTTL, JSON.stringify(content));
  } catch (e) {
    logger.warn('Redis set failed:', e.message);
  }
}

// Get cached explanation
async function getCachedExplanation(topic) {
  if (!redis) return null;
  try {
    const key = KEYS.hot(topic);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    logger.warn('Redis get failed:', e.message);
    return null;
  }
}

// Increment model counter
async function incrementModelCounter(model, tokens = 1) {
  if (!redis) return;
  try {
    const key = KEYS.modelCounter(model);
    await redis.incrby(key, tokens);
    await redis.expire(key, 86400); // 24 hours
  } catch (e) {
    // Ignore
  }
}

// Get model counter
async function getModelCounter(model) {
  if (!redis) return 0;
  try {
    const key = KEYS.modelCounter(model);
    const count = await redis.get(key);
    return count ? parseInt(count) : 0;
  } catch (e) {
    return 0;
  }
}

// Rate limiting helpers
async function checkRateLimit(userId, limit, window) {
  if (!redis) return true; // Allow if Redis down
  try {
    const key = userId ? KEYS.rateUser(userId) : KEYS.rateGlobal();
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    return current <= limit;
  } catch (e) {
    return true;
  }
}

module.exports = {
  setupRedis,
  getRedis,
  normalizeTopic,
  KEYS,
  cacheExplanation,
  getCachedExplanation,
  incrementModelCounter,
  getModelCounter,
  checkRateLimit,
};
