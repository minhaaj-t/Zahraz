const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { uploadBase64ToImgBB } = require('../utils/imageUpload');
const { verifyToken } = require('./auth');

// Get all banners
router.get('/', async (req, res) => {
  try {
    const [banners] = await pool.query(
      'SELECT * FROM banners ORDER BY orderIndex ASC, createdAt DESC'
    );
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create banner (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, subtitle, image, buttonText, buttonLink, orderIndex, isActive } = req.body;
    if (!title || !image) {
      return res.status(400).json({ success: false, error: 'Title and image are required' });
    }

    let imageUrl = image;
    if (image && typeof image === 'string' && image.startsWith('data:image')) {
      try {
        imageUrl = await uploadBase64ToImgBB(image);
      } catch (uploadError) {
        return res.status(500).json({ success: false, error: 'Failed to upload banner image' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO banners (title, subtitle, image, buttonText, buttonLink, orderIndex, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        subtitle || '',
        imageUrl,
        buttonText || '',
        buttonLink || '',
        orderIndex ?? 0,
        isActive !== undefined ? isActive : true
      ]
    );

    const [newBanner] = await pool.query('SELECT * FROM banners WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newBanner[0] });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update banner (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, subtitle, image, buttonText, buttonLink, orderIndex, isActive } = req.body;
    const bannerId = req.params.id;

    const [existingRows] = await pool.query('SELECT * FROM banners WHERE id = ?', [bannerId]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }
    const existing = existingRows[0];

    let imageUrl = image !== undefined ? image : existing.image;
    if (image && typeof image === 'string' && image.startsWith('data:image')) {
      try {
        imageUrl = await uploadBase64ToImgBB(image);
      } catch (uploadError) {
        return res.status(500).json({ success: false, error: 'Failed to upload banner image' });
      }
    }

    await pool.query(
      `UPDATE banners SET
        title = ?, subtitle = ?, image = ?, buttonText = ?, buttonLink = ?, orderIndex = ?, isActive = ?
       WHERE id = ?`,
      [
        title ?? existing.title,
        subtitle ?? existing.subtitle,
        imageUrl,
        buttonText ?? existing.buttonText,
        buttonLink ?? existing.buttonLink,
        orderIndex ?? existing.orderIndex,
        isActive !== undefined ? isActive : existing.isActive,
        bannerId
      ]
    );

    const [updated] = await pool.query('SELECT * FROM banners WHERE id = ?', [bannerId]);
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete banner (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

