const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const internshipRoutes = require('./routes/internship.routes');
const dummyRoutes = require('./routes/dummy.routes');
const adminRoutes = require('./routes/admin.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// CORS configuration supporting credentials (cookies) and local frontends
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body and cookie parsing
app.use(express.json());
app.use(cookieParser());

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'E-Learning Platform API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root API welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mountreach Solution E-Learning & Internship Platform API.',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

const mongoose = require('mongoose');

// Database Readiness Check Middleware
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || req.path.startsWith('/dummy')) {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'MongoDB Atlas is connecting or waiting for IP Whitelisting. Please ensure 0.0.0.0/0 or your current IP is added in MongoDB Atlas -> Network Access.',
      status: 'database_connecting',
    });
  }
  next();
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/dummy', dummyRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Middleware (must be after routes)
app.use(errorHandler);

module.exports = app;
