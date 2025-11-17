const express = require('express');
const router = express.Router();
const { query } = require('../db');
const logger = require('../utils/logger');

// POST /api/feedback - Submit feedback
router.post('/', async (req, res, next) => {
  try {
    const { user_id, topic, rating, note } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic required' });
    }

    // For now, just log feedback (can add feedback table later)
    logger.info('Feedback received:', { user_id, topic, rating, note });

    res.json({ 
      success: true,
      message: 'Thank you for your feedback!' 
    });

  } catch (error) {
    logger.error('Feedback error:', error);
    next(error);
  }
});

module.exports = router;
