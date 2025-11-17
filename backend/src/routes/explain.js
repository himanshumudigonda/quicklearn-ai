const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { 
  getCachedExplanation, 
  cacheExplanation, 
  normalizeTopic 
} = require('../cache');
const { generateExplanation } = require('../services/modelRouter');
const { validateExplanationResponse } = require('../utils/validation');
const logger = require('../utils/logger');

// POST /api/explain - Get explanation for a topic
router.post('/', async (req, res, next) => {
  try {
    const { topic, user_id, force_verify = false } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Valid topic required' });
    }

    const normalizedTopic = normalizeTopic(topic);
    const startTime = Date.now();

    // Step 1: Check Redis cache
    let cachedContent = await getCachedExplanation(normalizedTopic);
    if (cachedContent && !force_verify) {
      logger.info(`Cache hit for topic: ${normalizedTopic}`);
      
      // Update last_used in DB (async, don't wait)
      query(
        'UPDATE explanations SET last_used = NOW(), uses = uses + 1 WHERE topic = $1',
        [normalizedTopic]
      ).catch(err => logger.error('Failed to update last_used:', err));

      return res.json({
        topic: normalizedTopic,
        source: 'cache',
        content: cachedContent,
        cached: true,
        responseTime: Date.now() - startTime,
      });
    }

    // Step 2: Check Postgres
    const dbResult = await query(
      'SELECT content, source_model, verified FROM explanations WHERE topic = $1',
      [normalizedTopic]
    );

    if (dbResult.rows.length > 0 && !force_verify) {
      const explanation = dbResult.rows[0];
      logger.info(`DB hit for topic: ${normalizedTopic}`);

      // Cache it
      await cacheExplanation(normalizedTopic, explanation.content);

      // Update last_used
      query(
        'UPDATE explanations SET last_used = NOW(), uses = uses + 1 WHERE topic = $1',
        [normalizedTopic]
      ).catch(err => logger.error('Failed to update last_used:', err));

      return res.json({
        topic: normalizedTopic,
        source: 'database',
        content: explanation.content,
        cached: false,
        responseTime: Date.now() - startTime,
      });
    }

    // Step 3: Generate new explanation using model router
    logger.info(`Generating explanation for topic: ${normalizedTopic}`);
    const result = await generateExplanation(topic);

    if (!result.success) {
      return res.status(503).json({ 
        error: 'Unable to generate explanation at this time. Please try again later.',
        details: result.error 
      });
    }

    // Validate response
    const validation = validateExplanationResponse(result.content);
    if (!validation.valid) {
      logger.error('Invalid explanation format:', validation.errors);
      return res.status(500).json({ 
        error: 'Generated explanation format invalid',
        details: validation.errors 
      });
    }

    // Save to database
    await query(
      `INSERT INTO explanations (topic, content, source_model, verified, uses)
       VALUES ($1, $2, $3, $4, 1)
       ON CONFLICT (topic) DO UPDATE 
       SET content = $2, source_model = $3, updated_at = NOW(), uses = explanations.uses + 1`,
      [normalizedTopic, JSON.stringify(result.content), result.model, result.verified || false]
    );

    // Cache it
    await cacheExplanation(normalizedTopic, result.content);

    logger.info(`Explanation generated and saved: ${normalizedTopic} (${result.model})`);

    res.json({
      topic: normalizedTopic,
      source: result.model,
      content: result.content,
      cached: false,
      verification_enqueued: false,
      responseTime: Date.now() - startTime,
    });

  } catch (error) {
    logger.error('Explain error:', error);
    next(error);
  }
});

module.exports = router;
