/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const config = require('./config/env');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const contactRoutes = require('./routes/contact.routes');
const healthRoutes = require('./routes/health.routes');

// Create Express app
const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS
app.use(cors(config.cors));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Root route
app.get('/', (req, res) => {
  res.send('Landing page backend is running');
});

// API routes
app.use('/health', healthRoutes);
app.use('/api/contact', contactRoutes); // Singular (legacy/simple)
app.use('/api/contacts', contactRoutes); // Plural (REST standard)

// Legacy route for backward compatibility
app.use('/contact', contactRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
