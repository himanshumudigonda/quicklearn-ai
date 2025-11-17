require('dotenv').config();
const { Worker } = require('bullmq');
const { query } = require('./db');
const { setupRedis, getRedis, cacheExplanation, normalizeTopic } = require('./cache');
const { verifyExplanation } = require('./services/modelRouter');
const logger = require('./utils/logger');

let redis;

async function processVerificationJob(job) {
  const { topic, jobId, userId } = job.data;

  logger.info(`Processing verification job ${jobId} for topic: ${topic}`);

  try {
    // Update job status
    await query(
      'UPDATE jobs SET status = $1 WHERE id = $2',
      ['processing', jobId]
    );

    // Get existing explanation
    const normalizedTopic = normalizeTopic(topic);
    const existing = await query(
      'SELECT content FROM explanations WHERE topic = $1',
      [normalizedTopic]
    );

    if (existing.rows.length === 0) {
      throw new Error('No existing explanation found to verify');
    }

    const existingContent = existing.rows[0].content;

    // Verify with higher model
    const result = await verifyExplanation(topic, existingContent);

    if (!result.success) {
      throw new Error(result.error);
    }

    // Update database
    await query(
      `UPDATE explanations 
       SET content = $1, verified = true, source_model = $2, updated_at = NOW()
       WHERE topic = $3`,
      [JSON.stringify(result.content), result.model, normalizedTopic]
    );

    // Update cache
    await cacheExplanation(normalizedTopic, result.content, parseInt(process.env.CACHE_TTL_VERIFIED));

    // Mark job complete
    await query(
      `UPDATE jobs 
       SET status = $1, processed_at = NOW(), worker_log = $2
       WHERE id = $3`,
      ['completed', JSON.stringify({ success: true, model: result.model }), jobId]
    );

    logger.info(`Verification job ${jobId} completed successfully`);

    return { success: true };

  } catch (error) {
    logger.error(`Verification job ${jobId} failed:`, error);

    // Mark job failed
    await query(
      `UPDATE jobs 
       SET status = $1, processed_at = NOW(), worker_log = $2
       WHERE id = $3`,
      ['failed', JSON.stringify({ error: error.message }), jobId]
    );

    throw error;
  }
}

async function startWorker() {
  try {
    // Initialize Redis
    await setupRedis();
    redis = getRedis();

    logger.info('Worker starting...');

    const worker = new Worker(
      process.env.QUEUE_NAME || 'quicklearn-jobs',
      async (job) => {
        if (job.name === 'verify-explanation') {
          return await processVerificationJob(job);
        }
        logger.warn(`Unknown job type: ${job.name}`);
      },
      {
        connection: redis,
        concurrency: parseInt(process.env.WORKER_CONCURRENCY || 5),
        limiter: {
          max: 10,
          duration: 60000, // 10 jobs per minute
        },
      }
    );

    worker.on('completed', (job) => {
      logger.info(`Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed:`, err);
    });

    logger.info('Worker started successfully');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, closing worker...');
      await worker.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, closing worker...');
      await worker.close();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Worker startup failed:', error);
    process.exit(1);
  }
}

startWorker();
