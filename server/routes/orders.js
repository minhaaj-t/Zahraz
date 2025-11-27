const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');
    const ordersWithParsedItems = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));
    res.json({ success: true, data: ordersWithParsedItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    const order = {
      ...orders[0],
      items: JSON.parse(orders[0].items)
    };
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, address, phone, items, total } = req.body;

    const [result] = await pool.query(
      `INSERT INTO orders (customerName, customerEmail, address, phone, items, total, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        customerName,
        customerEmail || null,
        address,
        phone || null,
        JSON.stringify(items),
        total
      ]
    );

    const [newOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
    const order = {
      ...newOrder[0],
      items: JSON.parse(newOrder[0].items)
    };
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    
    const [updatedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    const order = {
      ...updatedOrder[0],
      items: JSON.parse(updatedOrder[0].items)
    };
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

