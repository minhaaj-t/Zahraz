# Deploying Backend to Vercel

## Setup Instructions

1. **Create a new Vercel project** for the backend:
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Import the repository: `minhaaj-t/Zahraz`
   - **Important**: Set **Root Directory** to `server`

2. **Configure Environment Variables** in Vercel:
   ```
   DB_HOST=db.fr-pari1.bengt.wasmernet.com
   DB_PORT=10272
   DB_NAME=astro_starter
   DB_USER=8cd19e60727e800018597f5918d8
   DB_PASSWORD=06928cd1-9e60-7462-8000-138f6045502c
   IMGBB_API_KEY=a3d9e520027ec0c51d0b608045ba5f17
   JWT_SECRET=zahraz_secret_key_2024
   PORT=5000
   ```

3. **Deploy**:
   - Vercel will automatically detect the `vercel.json` in the server folder
   - The serverless function will be created at `api/index.js`
   - All routes will be available at your Vercel URL

## API Endpoints

Once deployed, your API will be available at:
- `https://your-backend.vercel.app/api/products`
- `https://your-backend.vercel.app/api/orders`
- `https://your-backend.vercel.app/api/auth/login`
- `https://your-backend.vercel.app/api/stats`
- `https://your-backend.vercel.app/api/health`

## Update Frontend

After deploying the backend, update the frontend's `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

## Notes

- The server uses Vercel serverless functions
- Database initialization happens on first request (cold start)
- All routes are prefixed with `/api`
- The serverless function is located at `api/index.js`

