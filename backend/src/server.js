// Load environment variables (works locally, Vercel injects them directly)
try {
  require('dotenv').config();
} catch (e) {
  // Ignore in serverless environment
  console.log('dotenv not loaded (running in serverless)');
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Create app first
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware - must come before routes
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint - works without any dependencies
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL
  });
});

// Load dependencies (might fail in serverless if not properly bundled)
let logger, setupDatabase, setupRedis, routes, errorHandler, globalRateLimit;
let modulesLoaded = false;

try {
  logger = require('./utils/logger');
  const db = require('./db');
  setupDatabase = db.setupDatabase;
  const cache = require('./cache');
  setupRedis = cache.setupRedis;
  routes = require('./routes');
  const errorHandlerModule = require('./middleware/errorHandler');
  errorHandler = errorHandlerModule.errorHandler;
  const rateLimitModule = require('./middleware/rateLimit');
  globalRateLimit = rateLimitModule.globalRateLimit;
  modulesLoaded = true;
  
  // Global rate limiting
  app.use(globalRateLimit);
  
  // API Routes
  app.use('/api', routes);
  
  // Error handling
  app.use(errorHandler);
} catch (error) {
  console.error('Failed to load application modules:', error.message);
  console.error('Stack:', error.stack);
  
  // Fallback route if modules fail to load
  app.use('/api/*', (req, res) => {
    res.status(500).json({ 
      error: 'Service temporarily unavailable',
      message: 'Failed to initialize application modules',
      details: error.message 
    });
  });
}

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Initialize and start server
async function start() {
  try {
    if (!modulesLoaded) {
      console.error('Cannot start server - modules not loaded');
      return;
    }

    // Initialize database (optional - skip if no DATABASE_URL)
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
      try {
        await setupDatabase();
        logger.info('Database connected');
      } catch (dbError) {
        logger.warn('Database connection failed:', dbError.message);
      }
    } else {
      logger.warn('Skipping database connection (DATABASE_URL not configured)');
    }

    // Initialize Redis (optional - skip if no REDIS_URL)
    if (process.env.REDIS_URL && !process.env.REDIS_URL.includes('localhost')) {
      try {
        await setupRedis();
        logger.info('Redis connected');
      } catch (redisError) {
        logger.warn('Redis connection failed:', redisError.message);
      }
    } else {
      logger.warn('Skipping Redis connection (REDIS_URL not configured)');
    }

    // Start server (skip for Vercel serverless)
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        logger.info(`QuickLearn AI Backend running on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } else {
      logger.info('Running in serverless mode (Vercel)');
    }
  } catch (error) {
    const errorMessage = error.message || String(error);
    console.error('Failed to start server:', errorMessage);
    if (logger) {
      logger.error('Failed to start server:', error);
    }
    
    // Don't exit in production/serverless
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (logger) {
    logger.info('SIGTERM received, shutting down gracefully');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  if (logger) {
    logger.info('SIGINT received, shutting down gracefully');
  }
  process.exit(0);
});

// Only initialize if modules loaded successfully
if (modulesLoaded) {
  start().catch(err => {
    console.error('Startup error:', err);
  });
}

// Export for Vercel serverless
module.exports = app;
