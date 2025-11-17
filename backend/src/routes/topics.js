const express = require('express');
const router = express.Router();
const { query } = require('../db');
const logger = require('../utils/logger');

// GET /api/topics/popular - Get popular topics
router.get('/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const result = await query(
      `SELECT topic, uses, verified, updated_at 
       FROM explanations 
       ORDER BY uses DESC, updated_at DESC 
       LIMIT $1`,
      [limit]
    );

    res.json({
      topics: result.rows,
      count: result.rows.length,
    });

  } catch (error) {
    logger.error('Popular topics error:', error);
    next(error);
  }
});

// GET /api/topics/recent - Get recently used topics
router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const result = await query(
      `SELECT topic, uses, verified, last_used 
       FROM explanations 
       ORDER BY last_used DESC 
       LIMIT $1`,
      [limit]
    );

    res.json({
      topics: result.rows,
      count: result.rows.length,
    });

  } catch (error) {
    logger.error('Recent topics error:', error);
    next(error);
  }
});

// GET /api/topics/search - Search topics
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query too short (min 2 chars)' });
    }

    const result = await query(
      `SELECT topic, uses, verified 
       FROM explanations 
       WHERE topic ILIKE $1 
       ORDER BY uses DESC 
       LIMIT 20`,
      [`%${q}%`]
    );

    res.json({
      topics: result.rows,
      count: result.rows.length,
    });

  } catch (error) {
    logger.error('Search topics error:', error);
    next(error);
  }
});

module.exports = router;
