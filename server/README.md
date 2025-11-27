# ZAHRAZ Backend API

Node.js backend for ZAHRAZ e-commerce platform with MySQL database and ImgBB image upload.

## Setup

1. Install dependencies:
```bash
npm install
```

2. The `.env` file is already configured with database credentials and API keys.

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Authentication
- `POST /api/auth/login` - Admin login

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Database

The server automatically creates the following tables:
- `products` - Product information
- `orders` - Order details
- `users` - Admin users
- `categories` - Product categories

Dummy data is automatically inserted on first run.

## Image Upload

Images can be uploaded using ImgBB API. The server accepts base64 images and automatically uploads them to ImgBB.

