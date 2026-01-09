/**
 * Health Check Routes
 * Provides endpoints for monitoring system health
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /health
 * @desc    Basic health check
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  })
);

/**
 * @route   GET /health/db
 * @desc    Database health check
 * @access  Public
 */
router.get(
  '/db',
  asyncHandler(async (req, res) => {
    const result = await db.query('SELECT NOW()');
    
    res.status(200).json({
      status: 'success',
      message: 'Database is healthy',
      timestamp: result.rows[0].now,
    });
  })
);

module.exports = router;
