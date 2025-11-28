const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { uploadBase64ToImgBB } = require('../utils/imageUpload');
const { verifyToken } = require('../routes/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY createdAt DESC');
    // Parse images JSON string
    const parsedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [product.image],
      inStock: Boolean(product.inStock)
    }));
    res.json({ success: true, data: parsedProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE rating >= 4.7 ORDER BY rating DESC LIMIT 3'
    );
    const parsedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [product.image],
      inStock: Boolean(product.inStock)
    }));
    res.json({ success: true, data: parsedProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const product = {
      ...products[0],
      images: products[0].images ? JSON.parse(products[0].images) : [products[0].image],
      inStock: Boolean(products[0].inStock)
    };
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get related products
router.get('/:id/related', async (req, res) => {
  try {
    const [product] = await pool.query('SELECT category FROM products WHERE id = ?', [req.params.id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const [products] = await pool.query(
      'SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4',
      [product[0].category, req.params.id]
    );
    const parsedProducts = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [p.image],
      inStock: Boolean(p.inStock)
    }));
    res.json({ success: true, data: parsedProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create product (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, price, image, images, description, category, rating, reviews, inStock } = req.body;
    
    // If image is base64, upload to ImgBB
    let imageUrl = image;
    if (image && image.startsWith('data:image')) {
      try {
        imageUrl = await uploadBase64ToImgBB(image);
        console.log('✅ Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Image upload error:', uploadError);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to upload image: ' + uploadError.message 
        });
      }
    } else if (!image || image === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Product image is required' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, price, image, images, description, category, rating, reviews, inStock) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        imageUrl,
        JSON.stringify(images || [imageUrl]),
        description,
        category,
        rating || 4.5,
        reviews || 0,
        inStock !== undefined ? inStock : true
      ]
    );

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    const parsedProduct = {
      ...newProduct[0],
      images: newProduct[0].images ? JSON.parse(newProduct[0].images) : [newProduct[0].image],
      inStock: Boolean(newProduct[0].inStock)
    };
    res.status(201).json({ success: true, data: parsedProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, price, image, images, description, category, rating, reviews, inStock } = req.body;
    
    // Get existing product to preserve image if not changed
    const [existingProducts] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existingProducts.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const existingProduct = existingProducts[0];
    
    // If image is base64, upload to ImgBB
    let imageUrl = image;
    if (image && image.startsWith('data:image')) {
      try {
        imageUrl = await uploadBase64ToImgBB(image);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ success: false, error: 'Failed to upload image: ' + uploadError.message });
      }
    } else if (!image || image === '') {
      // If no image provided, keep existing image
      imageUrl = existingProduct.image;
    }

    // Prepare images array
    let imagesArray = images;
    if (!imagesArray || imagesArray.length === 0) {
      imagesArray = [imageUrl];
    } else if (image && image.startsWith('data:image')) {
      // If new image uploaded, update images array
      imagesArray = [imageUrl, ...imagesArray.filter(img => img !== imageUrl)];
    }

    await pool.query(
      `UPDATE products SET 
       name = ?, price = ?, image = ?, images = ?, description = ?, 
       category = ?, rating = ?, reviews = ?, inStock = ? 
       WHERE id = ?`,
      [
        name,
        price,
        imageUrl,
        JSON.stringify(imagesArray),
        description || existingProduct.description,
        category || existingProduct.category,
        rating !== undefined ? rating : existingProduct.rating,
        reviews !== undefined ? reviews : existingProduct.reviews,
        inStock !== undefined ? inStock : existingProduct.inStock,
        req.params.id
      ]
    );

    const [updatedProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const parsedProduct = {
      ...updatedProduct[0],
      images: updatedProduct[0].images ? JSON.parse(updatedProduct[0].images) : [updatedProduct[0].image],
      inStock: Boolean(updatedProduct[0].inStock)
    };
    res.json({ success: true, data: parsedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

