const { Pool } = require('pg');
const logger = require('../utils/logger');

let pool;

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured');
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 50, // Increased max connections
    idleTimeoutMillis: 30000, // Increased idle timeout to 30s
    connectionTimeoutMillis: 5000, // Increased connection timeout to 5s
  });

  // Test connection
  await pool.query('SELECT NOW()');

  // Create tables if not exist
  await createTables();

  return pool;
}

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure UUID generation functions are available (required for DEFAULT gen_random_uuid()).
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nickname TEXT NOT NULL,
        avatar_seed TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        last_seen TIMESTAMP DEFAULT NOW(),
        credits_verified INTEGER DEFAULT 0
      )
    `);

    // Explanations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS explanations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        topic TEXT UNIQUE NOT NULL,
        content JSONB NOT NULL,
        source_model TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_used TIMESTAMP DEFAULT NOW(),
        uses INTEGER DEFAULT 1
      )
    `);

    // Create index on topic for fast lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_explanations_topic ON explanations(topic)
    `);

    // Jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        topic TEXT NOT NULL,
        job_type TEXT NOT NULL,
        status TEXT DEFAULT 'queued',
        created_at TIMESTAMP DEFAULT NOW(),
        processed_at TIMESTAMP,
        worker_log JSONB
      )
    `);

    // Favorites table
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        explanation_id UUID NOT NULL REFERENCES explanations(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, explanation_id)
      )
    `);

    await client.query('COMMIT');
    logger.info('Database tables created/verified');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Failed to create tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

function getPool() {
  if (!pool) {
    // throw new Error('Database not initialized. Call setupDatabase first.');
    return null;
  }
  return pool;
}

module.exports = {
  setupDatabase,
  getPool,
  query: async (text, params) => {
    if (!pool) {
      logger.warn('Database query skipped (DB not connected)');
      return { rows: [], rowCount: 0 };
    }
    return pool.query(text, params);
  },
};
