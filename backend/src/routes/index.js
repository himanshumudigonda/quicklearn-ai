const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const explainRoutes = require('./explain');
const verifyRoutes = require('./verify');
const topicsRoutes = require('./topics');
const feedbackRoutes = require('./feedback');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/explain', explainRoutes);
router.use('/verify', verifyRoutes);
router.use('/topics', topicsRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
