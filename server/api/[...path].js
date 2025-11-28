// Vercel catch-all serverless function
const express = require('express');
const cors = require('cors');
const { initDatabase, insertDummyData } = require('../config/initDatabase');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
// Increase body size limit to 50MB for large image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
const productsRouter = require('../routes/products');
const ordersRouter = require('../routes/orders');
const authRouter = require('../routes/auth');
const statsRouter = require('../routes/stats');

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter.router);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'ZAHRAZ Backend API', endpoints: ['/api/products', '/api/orders', '/api/auth', '/api/stats', '/api/health'] });
});

// Error handling middleware - must be added after routes
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Initialize database on cold start
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      await initDatabase();
      await insertDummyData();
      dbInitialized = true;
      console.log('✅ Database initialized');
    } catch (error) {
      console.error('❌ Database initialization error:', error);
    }
  }
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Initialize database on first request
    await initializeDatabase();
    
    // Handle the request with Express app
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error', 
        message: error.message 
      });
    }
  }
};

