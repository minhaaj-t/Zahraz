const express = require('express');
const cors = require('cors');
const { initDatabase, insertDummyData } = require('./config/initDatabase');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow Netlify and localhost
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.NETLIFY_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.includes(allowed)) || 
        process.env.NODE_ENV === 'development' ||
        origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now - restrict in production
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const statsRouter = require('./routes/stats');

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter.router);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Initialize database and start server
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

