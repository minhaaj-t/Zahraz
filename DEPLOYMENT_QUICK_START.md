# Quick Deployment Guide

## 🚀 Deploy to Netlify (Frontend)

### Option 1: Via Netlify Dashboard (Easiest)

1. **Go to [Netlify](https://app.netlify.com)**
2. Click **"Add new site"** → **"Import an existing project"**
3. **Connect to GitHub** and select your `Zahraz` repository
4. **Build settings** (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Add Environment Variable:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.railway.app/api` (or your backend URL)
6. Click **"Deploy site"**

### Option 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd Zahraz
netlify deploy --prod
```

---

## 🔧 Deploy Backend to Railway (Recommended)

### Step 1: Create Railway Account
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your `Zahraz` repository
3. Railway will detect the `server` folder automatically
4. **Set Environment Variables:**
   ```
   DB_HOST=db.fr-pari1.bengt.wasmernet.com
   DB_PORT=10272
   DB_NAME=astro_starter
   DB_USER=8cd19e60727e800018597f5918d8
   DB_PASSWORD=06928cd1-9e60-7462-8000-138f6045502c
   IMGBB_API_KEY=a3d9e520027ec0c51d0b608045ba5f17
   JWT_SECRET=zahraz_secret_key_2024
   ```
5. Railway will generate a URL like: `https://your-app.railway.app`
6. **Copy this URL** - you'll need it for Netlify

### Step 3: Update Frontend Environment Variable
1. Go back to Netlify
2. Site settings → Environment variables
3. Update `NEXT_PUBLIC_API_URL` to: `https://your-app.railway.app/api`

---

## 📋 Complete Deployment Checklist

### Backend (Railway)
- [ ] Project created on Railway
- [ ] Repository connected
- [ ] All environment variables set
- [ ] Deployment successful
- [ ] Backend URL copied

### Frontend (Netlify)
- [ ] Site created on Netlify
- [ ] Repository connected
- [ ] `NEXT_PUBLIC_API_URL` environment variable set
- [ ] Build successful
- [ ] Site is live

### Testing
- [ ] Visit Netlify URL
- [ ] Products load from backend
- [ ] Admin login works (`/web-admin`)
- [ ] Image upload works
- [ ] Orders can be created

---

## 🔗 Alternative Backend Hosting

### Render.com
1. Create new **Web Service**
2. Connect GitHub repo
3. Root Directory: `server`
4. Build: `npm install`
5. Start: `npm start`
6. Add environment variables

### Heroku
1. Install Heroku CLI
2. `cd server`
3. `heroku create your-app-name`
4. Set environment variables
5. `git push heroku main`

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- ✅ Check `NEXT_PUBLIC_API_URL` is correct
- ✅ Verify backend is running (visit `/api/health`)
- ✅ Check CORS settings in backend

### Build fails
- ✅ Check Node.js version (18+)
- ✅ Verify all dependencies installed
- ✅ Check build logs for errors

### Backend not starting
- ✅ Verify all environment variables set
- ✅ Check database connection
- ✅ Review Railway/Render logs

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration

