const express = require('express');
const cors = require('cors');
const { initDatabase, insertDummyData } = require('./config/initDatabase');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const statsRouter = require('./routes/stats');
const bannersRouter = require('./routes/banners');

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter.router);
app.use('/api/stats', statsRouter);
app.use('/api/banners', bannersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'ZAHRAZ Backend API' });
});

// Initialize database on startup (only for non-serverless environments)
if (process.env.VERCEL !== '1') {
  async function startServer() {
    try {
      await initDatabase();
      await insertDummyData();
      
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
  startServer();
}

// Export for Vercel serverless functions
module.exports = app;

