# ZAHRAZ Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most admin endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Products

#### Get All Products
```
GET /products
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 199.99,
      "image": "https://...",
      "images": ["https://..."],
      "description": "...",
      "category": "Audio",
      "rating": 4.8,
      "reviews": 124,
      "inStock": true
    }
  ]
}
```

#### Get Featured Products
```
GET /products/featured
```

#### Get Product by ID
```
GET /products/:id
```

#### Get Related Products
```
GET /products/:id/related
```

#### Create Product (Protected)
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "price": 199.99,
  "image": "data:image/png;base64,..." or "https://...",
  "images": ["https://..."],
  "description": "Product description",
  "category": "Audio",
  "rating": 4.5,
  "reviews": 0,
  "inStock": true
}
```
Note: If `image` is a base64 string, it will be automatically uploaded to ImgBB.

#### Update Product (Protected)
```
PUT /products/:id
Authorization: Bearer <token>
```

#### Delete Product (Protected)
```
DELETE /products/:id
Authorization: Bearer <token>
```

### Orders

#### Get All Orders
```
GET /orders
```

#### Get Order by ID
```
GET /orders/:id
```

#### Create Order
```
POST /orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "address": "123 Main St",
  "phone": "+1234567890",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 199.99,
      "quantity": 2
    }
  ],
  "total": 399.98
}
```

#### Update Order Status
```
PUT /orders/:id/status
Content-Type: application/json

{
  "status": "completed" | "pending" | "cancelled"
}
```

#### Delete Order
```
DELETE /orders/:id
```

### Authentication

#### Admin Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@zahraz.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "admin@zahraz.com",
      "role": "admin"
    }
  }
}
```

### Statistics

#### Get Dashboard Statistics
```
GET /stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalProducts": 9,
    "totalOrders": 5,
    "totalRevenue": 1234.56,
    "inStockProducts": 8
  }
}
```

## Image Upload

The API supports automatic image upload to ImgBB. When creating or updating products:

1. **Base64 Image**: Send `data:image/png;base64,...` and it will be uploaded automatically
2. **URL**: Send a direct URL and it will be used as-is

## Database Schema

### Products Table
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR(255))
- `price` (DECIMAL(10,2))
- `image` (TEXT)
- `images` (TEXT, JSON array)
- `description` (TEXT)
- `category` (VARCHAR(100))
- `rating` (DECIMAL(3,2))
- `reviews` (INT)
- `inStock` (BOOLEAN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Orders Table
- `id` (INT, Primary Key, Auto Increment)
- `customerName` (VARCHAR(255))
- `customerEmail` (VARCHAR(255))
- `address` (TEXT)
- `phone` (VARCHAR(50))
- `total` (DECIMAL(10,2))
- `status` (VARCHAR(50))
- `items` (TEXT, JSON array)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Users Table
- `id` (INT, Primary Key, Auto Increment)
- `email` (VARCHAR(255), Unique)
- `password` (VARCHAR(255), Hashed)
- `role` (VARCHAR(50))
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Categories Table
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR(100), Unique)
- `createdAt` (TIMESTAMP)

