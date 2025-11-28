# Vercel Deployment Guide

## Overview

This project is configured to deploy the **Next.js frontend** to Vercel, while the **Node.js backend server** should be hosted separately (e.g., Railway, Render, Heroku, or a VPS).

## Project Structure

```
Zahraz/
├── app/                    # Next.js app directory (deployed to Vercel)
├── components/             # React components (deployed to Vercel)
├── lib/                    # Frontend utilities (deployed to Vercel)
├── server/                 # Node.js backend (IGNORED by Vercel)
│   ├── routes/
│   ├── config/
│   └── utils/
└── vercel.json             # Vercel configuration
```

## Vercel Configuration

### Files Created

1. **`.vercelignore`** - Tells Vercel to ignore the `server/` folder
2. **`vercel.json`** - Vercel deployment configuration
3. **`next.config.js`** - Updated with image domains for ImgBB

### What Gets Deployed to Vercel

✅ **Deployed:**
- Next.js frontend (app/, components/, lib/)
- All React/Next.js code
- Frontend dependencies

❌ **Ignored (Not Deployed):**
- `server/` folder (Node.js backend)
- Backend documentation files
- `.env` files

## Deployment Steps

### 1. Deploy Frontend to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd Zahraz
vercel

# Follow the prompts
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `minhaaj-t/Zahraz`
4. Vercel will auto-detect Next.js
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```
7. Click "Deploy"

### 2. Host Backend Separately

The `server/` folder needs to be hosted on a different platform:

#### Recommended Platforms:
- **Railway** (railway.app) - Easy Node.js hosting
- **Render** (render.com) - Free tier available
- **Heroku** - Classic platform
- **DigitalOcean App Platform** - Simple deployment
- **VPS** (DigitalOcean, AWS EC2, etc.) - Full control

#### Backend Deployment Example (Railway):
```bash
cd server
railway init
railway up
```

## Environment Variables

### Frontend (Vercel)
Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Backend (Separate Host)
Set these in your backend hosting platform:

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

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to separate platform
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel environment variables
- [ ] Backend environment variables configured
- [ ] Database connection working
- [ ] API endpoints accessible
- [ ] Image uploads working (ImgBB)
- [ ] Admin login working
- [ ] Products loading from API

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is running and accessible
- Check CORS settings in backend (should allow Vercel domain)

### Images not loading
- Verify `next.config.js` has correct image domains
- Check ImgBB API key is set in backend
- Ensure image URLs are accessible

### Build errors
- Check Node.js version (Vercel uses Node 18+ by default)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

## Custom Domain

To add a custom domain:
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_API_URL` if needed

## Monitoring

- **Vercel Analytics:** Built-in performance monitoring
- **Vercel Logs:** View real-time logs in dashboard
- **Backend Logs:** Check your backend hosting platform

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project Issues: Check GitHub repository

