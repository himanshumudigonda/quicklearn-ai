const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { makeNickname, generateAvatarSeed } = require('../utils/nickname');
const logger = require('../utils/logger');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info('Firebase Admin initialized');
  } catch (error) {
    logger.error('Firebase Admin init failed:', error);
  }
}

// POST /api/auth/login - Google Sign-In
router.post('/login', async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    let userId;
    let email;

    // Try to verify with Firebase Admin
    try {
      if (admin.apps.length) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        userId = decodedToken.uid;
        email = decodedToken.email;
      } else {
        throw new Error('Firebase Admin not initialized');
      }
    } catch (authError) {
      logger.warn('Firebase verification failed (running in offline/demo mode):', authError.message);
      // Fallback: Decode token without verification (insecure, but allows demo to work)
      // OR just generate a mock ID based on the token length to simulate a user
      userId = 'demo-user-' + Date.now();
    }

    // Check if user exists
    let user = await query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    let userData;

    // Handle DB Offline or User Not Found
    if (!user || !user.rows || user.rows.length === 0) {
      // Create new user (or mock one if DB is down)
      const nickname = makeNickname(userId);
      const avatarSeed = generateAvatarSeed();

      // Try to insert if DB is up
      try {
        await query(
          'INSERT INTO users (id, nickname, avatar_seed) VALUES ($1, $2, $3)',
          [userId, nickname, avatarSeed]
        );
      } catch (dbError) {
        logger.warn('DB Insert failed (ignoring):', dbError.message);
      }

      // Use the data we just generated
      userData = {
        id: userId,
        nickname,
        avatar_seed: avatarSeed,
        credits_verified: 0
      };
    } else {
      // Update last_seen
      try {
        await query(
          'UPDATE users SET last_seen = NOW() WHERE id = $1',
          [userId]
        );
      } catch (e) {}
      
      userData = user.rows[0];
    }

    // Generate JWT session token
    const sessionToken = jwt.sign(
      { userId, nickname: userData.nickname },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '30d' }
    );

    res.json({
      sessionToken,
      nickname: userData.nickname,
      avatarSeed: userData.avatar_seed,
      creditsVerified: userData.credits_verified || 0,
    });

  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
});

// POST /api/auth/regenerate-nickname - Regenerate nickname
router.post('/regenerate-nickname', async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const newNickname = makeNickname(userId + Date.now());
    
    await query(
      'UPDATE users SET nickname = $1 WHERE id = $2',
      [newNickname, userId]
    );

    res.json({ nickname: newNickname });

  } catch (error) {
    logger.error('Regenerate nickname error:', error);
    next(error);
  }
});

// POST /api/auth/regenerate-avatar - Regenerate avatar seed
router.post('/regenerate-avatar', async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const newSeed = generateAvatarSeed();
    
    await query(
      'UPDATE users SET avatar_seed = $1 WHERE id = $2',
      [newSeed, userId]
    );

    res.json({ avatarSeed: newSeed });

  } catch (error) {
    logger.error('Regenerate avatar error:', error);
    next(error);
  }
});

module.exports = router;
