# ZAHRA'Z E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js, Node.js, MySQL, and ImgBB image hosting.

## 🚀 Features

- **Modern UI/UX** - Beautiful, responsive design with smooth animations
- **Product Management** - Full CRUD operations with image upload
- **Admin Dashboard** - Complete admin panel for managing products and orders
- **Shopping Cart** - Add to cart, wishlist, and checkout functionality
- **WhatsApp Integration** - Direct order placement via WhatsApp
- **Image Upload** - Automatic image hosting via ImgBB API
- **MySQL Database** - Robust data storage with automatic schema creation
- **JWT Authentication** - Secure admin authentication

## 📁 Project Structure

```
Zahraz/
├── app/                    # Next.js app directory
│   ├── web-admin/         # Admin panel pages
│   ├── product/           # Product detail pages
│   ├── wishlist/          # Wishlist page
│   └── offers/            # Offers page
├── components/             # React components
│   ├── admin-dashboard.tsx # Admin dashboard
│   ├── image-upload.tsx   # Image upload component
│   └── ...
├── lib/                    # Utilities
│   ├── api.ts             # API client functions
│   └── products.ts        # Product types
├── server/                 # Node.js backend (hosted separately)
│   ├── routes/            # API routes
│   ├── config/            # Database config
│   └── utils/             # Utilities
└── vercel.json            # Vercel configuration
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - UI components
- **Lucide Icons** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **ImgBB API** - Image hosting
- **Bcrypt** - Password hashing

## 📦 Installation

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file (see server/.env.example)
# Add your database credentials and API keys

# Start server
npm start

# Or use nodemon for development
npm run dev
```

## 🌐 Deployment

### Frontend (Vercel)

The frontend is configured to deploy to Vercel. The `server/` folder is automatically ignored.

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Next.js
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```
4. Deploy!

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

### Backend (Separate Hosting)

The backend should be hosted separately on:
- Railway
- Render
- Heroku
- DigitalOcean
- Or any Node.js hosting platform

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for backend deployment.

## 🔐 Default Credentials

**Admin Login:**
- Email: `admin@zahraz.com`
- Password: `admin123`

⚠️ **Change these in production!**

## 📚 Documentation

- [Backend Setup Guide](./BACKEND_SETUP.md)
- [API Documentation](./server/API_DOCUMENTATION.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md)

## 🔧 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
IMGBB_API_KEY=your-imgbb-key
JWT_SECRET=your-jwt-secret
PORT=5000
```

## 🎯 API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /products` - Get all products
- `GET /products/featured` - Get featured products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `POST /orders` - Create order
- `GET /orders` - Get all orders
- `POST /auth/login` - Admin login
- `GET /stats` - Get statistics

See [API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md) for complete API reference.

## 📝 License

ISC

## 👤 Author

minhaaj-t

## 🙏 Acknowledgments

- ImgBB for image hosting
- Vercel for frontend hosting
- All open-source contributors
