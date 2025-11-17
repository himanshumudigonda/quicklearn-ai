# QuickLearn AI - Frontend Deployment Quick Guide

## Your Current Backend Status: ✅ DEPLOYED

Your backend is live on Vercel! To find the URL:
1. Go to https://vercel.com/dashboard
2. Click on your backend project
3. Copy the URL (e.g., `https://your-project.vercel.app`)

---

## Deploy Frontend in 3 Steps

### Step 1: Update API URL

Replace `YOUR-BACKEND-URL` with your actual Vercel backend URL:

**File**: `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app
```

**Quick edit command**:
```bash
# Replace YOUR-BACKEND-URL with your actual URL
notepad frontend\.env.local
```

### Step 2: Commit Changes

```bash
git add frontend/.env.local DEPLOYMENT_STEPS.md FRONTEND_DEPLOY.md
git commit -m "Prepare frontend for deployment"
git push
```

### Step 3: Deploy to Vercel

**Via Browser** (Easiest):
1. Go to: https://vercel.com/new
2. Select repository: `himanshumudigonda/quicklearn-ai`
3. Click "Import"
4. Set **Root Directory**: `frontend`
5. Add environment variables (copy from `frontend/.env.local`)
6. Click "Deploy"

**Via CLI** (Faster):
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

---

## Environment Variables for Vercel Frontend

Copy these to Vercel when deploying:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDi9wkFjgmeB_hcKG1yaZJ2Q5-1K_uwx9A
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quicklearn-ai-ba56b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quicklearn-ai-ba56b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quicklearn-ai-ba56b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1096155237120
NEXT_PUBLIC_FIREBASE_APP_ID=1:1096155237120:web:a51c52a9b1cd5c9d4a01e5
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-J0YQ32L4ZS
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app
```

⚠️ **Important**: Replace `YOUR-BACKEND-URL` with your actual backend URL!

---

## After Frontend Deploys

### Configure Firebase
1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `quicklearn-ai-ba56b`
3. Go to Authentication → Settings → Authorized domains
4. Click "Add domain"
5. Add your frontend URL: `your-frontend-name.vercel.app`

### Test Everything
1. Open your frontend URL
2. Click "Sign in with Google"
3. Enter topic: "black holes"
4. Verify AI explanation appears
5. Test favorites and history

---

## Optional: Database & Redis Setup

### Neon.tech (PostgreSQL) - 5 minutes
1. Sign up: https://neon.tech
2. Create project: "quicklearn-ai-db"
3. Copy connection string
4. Add to Vercel backend as `DATABASE_URL`
5. Redeploy backend

### Upstash (Redis) - 5 minutes
1. Sign up: https://upstash.com
2. Create database: "quicklearn-ai-cache"
3. Copy REST API URL
4. Add to Vercel backend as `REDIS_URL`
5. Redeploy backend

---

## Quick Commands Reference

```bash
# Find your backend URL (check Vercel dashboard)
# Then update frontend/.env.local

# Commit and push
git add .
git commit -m "Ready for production deployment"
git push

# Deploy frontend
cd frontend
vercel --prod

# That's it! 🚀
```

---

## Current Status

✅ Backend deployed and working
⏳ Frontend ready (needs backend URL + deployment)
⏳ Database optional
⏳ Redis optional

**You're almost there!** Just need to:
1. Get backend URL from Vercel
2. Update frontend/.env.local
3. Deploy frontend

Total time: ~5 minutes
