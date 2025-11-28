// Vercel serverless function entry point
const app = require('../server');

// Initialize database on cold start
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      const { initDatabase, insertDummyData } = require('../config/initDatabase');
      await initDatabase();
      await insertDummyData();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }
}

module.exports = async (req, res) => {
  // Initialize database on first request
  await initializeDatabase();
  
  // Handle the request
  return app(req, res);
};

