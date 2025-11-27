# Backend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MySQL database access

## Setup Steps

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with:
   - Database credentials
   - ImgBB API key
   - JWT secret

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. The server will automatically:
   - Create database tables
   - Insert dummy data
   - Start on port 5000

## API Endpoints

Base URL: `http://localhost:5000/api`

### Products
- `GET /products` - Get all products
- `GET /products/featured` - Get featured products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (requires auth)
- `PUT /products/:id` - Update product (requires auth)
- `DELETE /products/:id` - Delete product (requires auth)

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create order
- `PUT /orders/:id/status` - Update order status

### Authentication
- `POST /auth/login` - Admin login
  - Body: `{ "email": "admin@zahraz.com", "password": "admin123" }`

### Statistics
- `GET /stats` - Get dashboard statistics

## Database Tables

The following tables are automatically created:
- `products` - Product information
- `orders` - Order details
- `users` - Admin users
- `categories` - Product categories

## Default Admin Credentials

- Email: `admin@zahraz.com`
- Password: `admin123`

## Image Upload

The backend supports image upload via ImgBB API. When creating/updating products, you can send base64 images and they will be automatically uploaded to ImgBB.

