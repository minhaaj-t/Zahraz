const pool = require('./database');

async function initDatabase() {
  try {
    // Create Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image TEXT NOT NULL,
        images TEXT,
        description TEXT,
        category VARCHAR(100),
        rating DECIMAL(3, 2) DEFAULT 4.5,
        reviews INT DEFAULT 0,
        inStock BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Orders Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customerName VARCHAR(255) NOT NULL,
        customerEmail VARCHAR(255),
        address TEXT NOT NULL,
        phone VARCHAR(50),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        items TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Users Table (for admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Categories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

async function insertDummyData() {
  try {
    // Check if data already exists
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
    if (products[0].count > 0) {
      console.log('✅ Dummy data already exists');
      return;
    }

    // Insert Categories
    await pool.query(`
      INSERT INTO categories (name) VALUES
      ('Audio'),
      ('Wearables'),
      ('Mobile'),
      ('Accessories')
    `);

    // Insert Products
    await pool.query(`
      INSERT INTO products (name, price, image, images, description, category, rating, reviews, inStock) VALUES
      ('Premium Headphones', 199.99, '/1zC9sqrG/2148205486.jpg', '["/1zC9sqrG/2148205486.jpg"]', 'Experience premium sound quality with our top-of-the-line headphones. Featuring active noise cancellation, 30-hour battery life, and superior comfort for extended listening sessions.', 'Audio', 4.8, 124, TRUE),
      ('Smartwatch Pro', 299.99, '/Wz6pRfW3/2149436737.jpg', '["/Wz6pRfW3/2149436737.jpg"]', 'Stay connected and track your fitness with the Smartwatch Pro. Features include heart rate monitoring, GPS tracking, water resistance, and a vibrant AMOLED display.', 'Wearables', 4.9, 89, TRUE),
      ('Wireless Earbuds', 149.99, '/YqRn0fTm/13446.jpg', '["/YqRn0fTm/13446.jpg"]', 'Compact and powerful wireless earbuds with crystal-clear audio. Perfect for workouts and daily commutes with 8-hour battery life and quick charge capability.', 'Audio', 4.7, 203, TRUE),
      ('IPHONE 16 Pro Max', 5099.00, '/FRtqQFJr/6208003-3207184.jpg', '["/FRtqQFJr/6208003-3207184.jpg"]', 'The latest iPhone with cutting-edge technology. Features include a powerful A18 chip, advanced camera system, and all-day battery life. Available in multiple storage options.', 'Mobile', 4.9, 456, TRUE),
      ('Portable Charger', 49.99, '/13r2Z1rw/32540410-m011t0410-b-wifi-extender-10aug22.jpg', '["/13r2Z1rw/32540410-m011t0410-b-wifi-extender-10aug22.jpg"]', 'Never run out of power with our high-capacity portable charger. Fast charging technology and compact design make it perfect for travel.', 'Accessories', 4.6, 312, TRUE),
      ('Bluetooth Speaker', 79.99, '/wvsxTBv7/32555155-m028t0128-a-speaker-12aug22.jpg', '["/wvsxTBv7/32555155-m028t0128-a-speaker-12aug22.jpg"]', 'Powerful portable speaker with 360-degree sound. Waterproof design and 20-hour battery life make it perfect for outdoor adventures.', 'Audio', 4.5, 178, TRUE),
      ('Fitness Tracker', 89.99, '/9FDbX5Ps/7744142-3732605.jpg', '["/9FDbX5Ps/7744142-3732605.jpg"]', 'Track your health and fitness goals with this advanced fitness tracker. Monitors steps, heart rate, sleep, and more with a sleek, comfortable design.', 'Wearables', 4.7, 267, TRUE),
      ('Wireless Mouse', 29.99, '/KcHCxy3g/2147916467.jpg', '["/KcHCxy3g/2147916467.jpg"]', 'Ergonomic wireless mouse with precision tracking. Long battery life and comfortable design for extended use.', 'Accessories', 4.4, 145, TRUE),
      ('USB-C Hub', 59.99, '/7Yp6Ccd5/6123978-22838.jpg', '["/7Yp6Ccd5/6123978-22838.jpg"]', 'Expand your connectivity with this versatile USB-C hub. Features multiple ports including HDMI, USB 3.0, and SD card reader.', 'Accessories', 4.6, 198, TRUE)
    `);

    // Insert Admin User (password: admin123 hashed with bcrypt)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (email, password, role) VALUES
      ('admin@zahraz.com', ?, 'admin')
    `, [hashedPassword]);

    console.log('✅ Dummy data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting dummy data:', error);
    throw error;
  }
}

module.exports = { initDatabase, insertDummyData };

