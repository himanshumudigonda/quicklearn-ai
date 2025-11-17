const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { getRedis, getModelCounter } = require('../cache');
const logger = require('../utils/logger');

// Simple admin auth middleware
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}

router.use(adminAuth);

// GET /api/admin/stats - Get system stats
router.get('/stats', async (req, res, next) => {
  try {
    // Get DB stats
    const userCount = await query('SELECT COUNT(*) FROM users');
    const explanationCount = await query('SELECT COUNT(*) FROM explanations');
    const verifiedCount = await query('SELECT COUNT(*) FROM explanations WHERE verified = true');
    const jobStats = await query(
      `SELECT status, COUNT(*) as count 
       FROM jobs 
       GROUP BY status`
    );

    // Get Redis stats
    const redis = getRedis();
    const redisInfo = await redis.info('stats');
    const cacheKeys = await redis.dbsize();

    // Get model counters
    const models = [
      'groq/compound-mini',
      'groq/compound',
      'meta-llama/llama-4-scout-17b',
      'openai/gpt-oss-120b',
    ];

    const modelCounters = {};
    for (const model of models) {
      modelCounters[model] = await getModelCounter(model);
    }

    res.json({
      database: {
        users: parseInt(userCount.rows[0].count),
        explanations: parseInt(explanationCount.rows[0].count),
        verified: parseInt(verifiedCount.rows[0].count),
      },
      jobs: jobStats.rows,
      cache: {
        keys: cacheKeys,
        redisInfo: redisInfo.split('\n').filter(line => line.includes('total')),
      },
      models: modelCounters,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Admin stats error:', error);
    next(error);
  }
});

// GET /api/admin/top-topics - Get top used topics
router.get('/top-topics', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const result = await query(
      `SELECT topic, uses, verified, source_model, created_at, last_used
       FROM explanations
       ORDER BY uses DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      topics: result.rows,
      count: result.rows.length,
    });

  } catch (error) {
    logger.error('Admin top topics error:', error);
    next(error);
  }
});

// GET /api/admin/recent-jobs - Get recent jobs
router.get('/recent-jobs', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const result = await query(
      `SELECT id, topic, job_type, status, created_at, processed_at
       FROM jobs
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      jobs: result.rows,
      count: result.rows.length,
    });

  } catch (error) {
    logger.error('Admin recent jobs error:', error);
    next(error);
  }
});

module.exports = router;
