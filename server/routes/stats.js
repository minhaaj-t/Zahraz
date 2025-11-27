const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [revenue] = await pool.query('SELECT SUM(total) as total FROM orders');
    const [inStockCount] = await pool.query('SELECT COUNT(*) as count FROM products WHERE inStock = TRUE');

    const stats = {
      totalProducts: productCount[0].count,
      totalOrders: orderCount[0].count,
      totalRevenue: revenue[0].total || 0,
      inStockProducts: inStockCount[0].count
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

