# Netlify Deployment Guide

## Overview

This project consists of two parts:
1. **Frontend (Next.js)** - Can be deployed on Netlify
2. **Backend (Node.js)** - Needs separate hosting (Railway, Render, etc.)

## Frontend Deployment on Netlify

### Step 1: Prepare for Deployment

1. **Set Environment Variables in Netlify:**
   - Go to your Netlify site settings
   - Navigate to "Environment variables"
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`

### Step 2: Deploy via Netlify Dashboard

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your `Zahraz` repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** (leave empty or set to root)
5. Add environment variable: `NEXT_PUBLIC_API_URL`
6. Click "Deploy site"

### Step 3: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
cd Zahraz
netlify init
netlify deploy --prod
```

## Backend Deployment Options

Since Netlify doesn't support long-running Node.js servers, deploy the backend separately:

### Option 1: Railway (Recommended)

1. Go to [Railway](https://railway.app)
2. Create new project → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the `server` folder
5. Set environment variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `IMGBB_API_KEY`
   - `JWT_SECRET`
   - `PORT` (Railway will set this automatically)
6. Update `NEXT_PUBLIC_API_URL` in Netlify to Railway's URL

### Option 2: Render

1. Go to [Render](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables
6. Deploy

### Option 3: Heroku

1. Install Heroku CLI
2. Create `Procfile` in `server/` folder:
   ```
   web: node server.js
   ```
3. Deploy:
   ```bash
   cd server
   heroku create your-app-name
   heroku config:set DB_HOST=...
   heroku config:set DB_PORT=...
   # ... set all env variables
   git push heroku main
   ```

## Environment Variables Setup

### Frontend (Netlify)
- `NEXT_PUBLIC_API_URL` - Your backend API URL

### Backend (Railway/Render/Heroku)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `IMGBB_API_KEY` - ImgBB API key
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port (usually auto-set by hosting)

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend environment variable points to backend
- [ ] Database connection is working
- [ ] API endpoints are responding
- [ ] Image upload is working
- [ ] Admin login works
- [ ] Products load correctly

## Troubleshooting

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is publicly accessible

### Build fails on Netlify
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Backend deployment issues
- Verify all environment variables are set
- Check database connection credentials
- Ensure port is correctly configured

