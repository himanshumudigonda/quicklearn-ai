require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const { setupDatabase } = require('./db');
const { setupRedis } = require('./cache');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { globalRateLimit } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiting
app.use(globalRateLimit);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize and start server
async function start() {
  try {
    // Initialize database (optional - skip if no DATABASE_URL)
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
      await setupDatabase();
      logger.info('Database connected');
    } else {
      logger.warn('Skipping database connection (DATABASE_URL not configured)');
    }

    // Initialize Redis (optional - skip if no REDIS_URL)
    if (process.env.REDIS_URL && !process.env.REDIS_URL.includes('localhost')) {
      await setupRedis();
      logger.info('Redis connected');
    } else {
      logger.warn('Skipping Redis connection (REDIS_URL not configured)');
    }

    // Start server (skip for Vercel serverless)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        logger.info(`QuickLearn AI Backend running on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } else {
      logger.info('Running in serverless mode (Vercel)');
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Initialize on startup
start();

module.exports = app;
