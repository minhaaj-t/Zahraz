# Frontend-Backend Integration Guide

## Overview

The React/Next.js frontend is now fully connected to the Node.js backend API with MySQL database and ImgBB image upload.

## Setup Instructions

### 1. Start the Backend Server

```bash
cd server
npm install
npm start
```

The server will:
- Connect to MySQL database
- Create all tables automatically
- Insert dummy data
- Start on `http://localhost:5000`

### 2. Start the Frontend

```bash
# In the root directory
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Environment Configuration

The `.env.local` file is already configured with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Features Integrated

### ✅ Product Management
- **Frontend**: Fetches products from `/api/products`
- **Admin Panel**: Full CRUD operations with image upload
- **Image Upload**: Drag & drop or click to upload images
- **Auto Upload**: Base64 images automatically uploaded to ImgBB

### ✅ Order Management
- **Checkout**: Orders saved to database via `/api/orders`
- **Admin View**: All orders visible in admin dashboard
- **WhatsApp Integration**: Still sends to WhatsApp + saves to DB

### ✅ Authentication
- **Login**: Uses `/api/auth/login` endpoint
- **JWT Tokens**: Stored in localStorage
- **Protected Routes**: Admin endpoints require authentication

### ✅ Statistics
- **Real-time Stats**: Fetched from `/api/stats`
- **Dashboard**: Shows products, orders, revenue, stock

## API Endpoints Used

### Products
- `GET /api/products` - All products
- `GET /api/products/featured` - Featured products
- `GET /api/products/:id` - Single product
- `GET /api/products/:id/related` - Related products
- `POST /api/products` - Create (admin)
- `PUT /api/products/:id` - Update (admin)
- `DELETE /api/products/:id` - Delete (admin)

### Orders
- `GET /api/orders` - All orders
- `POST /api/orders` - Create order

### Authentication
- `POST /api/auth/login` - Admin login

### Statistics
- `GET /api/stats` - Dashboard statistics

## Image Upload Flow

1. User selects image in admin panel
2. Image converted to base64
3. Sent to backend in product data
4. Backend uploads to ImgBB API
5. ImgBB URL returned and saved to database
6. Product displayed with ImgBB hosted image

## Database Tables

- `products` - All product information
- `orders` - Customer orders
- `users` - Admin users
- `categories` - Product categories

## Testing

1. **Test Products**: Visit homepage - products load from API
2. **Test Admin**: Login at `/web-admin` with `admin@zahraz.com` / `admin123`
3. **Test Image Upload**: Add new product with image upload
4. **Test Orders**: Complete checkout - order saved to database
5. **Test Product Details**: Click any product - loads from API

## Troubleshooting

### Backend not connecting
- Check if server is running on port 5000
- Verify database credentials in `.env`
- Check MySQL connection

### Images not uploading
- Verify ImgBB API key in server `.env`
- Check browser console for errors
- Ensure image is valid format (JPG, PNG, GIF)

### Products not loading
- Check if backend is running
- Verify API URL in `.env.local`
- Check browser network tab for API calls

