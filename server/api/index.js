// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const { initDatabase, insertDummyData } = require('../config/initDatabase');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.json({ success: true, message: 'ZAHRAZ Backend API' });
});

// Initialize database on cold start
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      await initDatabase();
      await insertDummyData();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Initialize database on first request
  await initializeDatabase();
  
  // Handle the request
  return app(req, res);
};
