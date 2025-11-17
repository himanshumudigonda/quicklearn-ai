const express = require('express');
const router = express.Router();
const { Queue } = require('bullmq');
const { query } = require('../db');
const { getRedis } = require('../cache');
const logger = require('../utils/logger');

// Initialize job queue
const jobQueue = new Queue(process.env.QUEUE_NAME || 'quicklearn-jobs', {
  connection: getRedis(),
});

// POST /api/verify - Request verification for a topic
router.post('/', async (req, res, next) => {
  try {
    const { topic, user_id, priority = 'normal' } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Valid topic required' });
    }

    // Create job in database
    const jobResult = await query(
      `INSERT INTO jobs (topic, job_type, status) 
       VALUES ($1, 'verify', 'queued')
       RETURNING id`,
      [topic]
    );

    const jobId = jobResult.rows[0].id;

    // Add to queue
    await jobQueue.add(
      'verify-explanation',
      { topic, jobId, userId: user_id },
      { 
        priority: priority === 'high' ? 1 : 10,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      }
    );

    logger.info(`Verification job queued: ${jobId} for topic: ${topic}`);

    res.json({
      jobId,
      status: 'queued',
      message: 'Verification request accepted',
    });

  } catch (error) {
    logger.error('Verify error:', error);
    next(error);
  }
});

// GET /api/verify/:jobId - Check verification status
router.get('/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const result = await query(
      'SELECT * FROM jobs WHERE id = $1',
      [jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = result.rows[0];

    res.json({
      jobId: job.id,
      topic: job.topic,
      status: job.status,
      createdAt: job.created_at,
      processedAt: job.processed_at,
      log: job.worker_log,
    });

  } catch (error) {
    logger.error('Verify status error:', error);
    next(error);
  }
});

module.exports = router;
