# QuickLearn AI - Complete Deployment Guide

## ✅ Completed Steps

### Backend Deployment
- [x] Backend deployed to Vercel
- [x] GROQ_API_KEY configured
- [x] FIREBASE_ADMIN_JSON configured
- [x] Health check working
- [x] API endpoints responding

**Your Backend URL**: Check your Vercel dashboard for the exact URL (e.g., `https://your-app-name.vercel.app`)

---

## 📋 Next Steps

### Step 1: Set Up PostgreSQL Database (Optional but Recommended)

**Why**: Stores user data, explanations cache, favorites - enables persistence

1. Go to **https://neon.tech**
2. Sign up with GitHub (free forever - 512MB storage)
3. Create a new project: "quicklearn-ai-db"
4. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

5. Add to Vercel Backend:
   - Go to Vercel dashboard → Your backend project → Settings → Environment Variables
   - Add: `DATABASE_URL` = (paste the connection string)
   - Click "Redeploy" to apply changes

### Step 2: Set Up Redis Cache (Optional but Recommended)

**Why**: Rate limiting, hot cache for popular topics, real-time counters

1. Go to **https://upstash.com**
2. Sign up with GitHub (free forever - 10k requests/day)
3. Create Redis database: "quicklearn-ai-cache"
4. Copy the connection string from REST API section (looks like):
   ```
   rediss://default:xxxxx@xxxxx.upstash.io:6379
   ```

5. Add to Vercel Backend:
   - Go to Vercel dashboard → Your backend project → Settings → Environment Variables
   - Add: `REDIS_URL` = (paste the connection string)
   - Click "Redeploy"

### Step 3: Deploy Frontend

#### 3.1 Update Frontend Configuration

1. Find your backend URL from Vercel dashboard (e.g., `https://quicklearn-ai-backend.vercel.app`)

2. Update `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app
   ```

3. Commit changes:
   ```bash
   git add frontend/.env.local
   git commit -m "Update API URL for production"
   git push
   ```

#### 3.2 Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to **https://vercel.com/new**
2. Import your GitHub repository: `himanshumudigonda/quicklearn-ai`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. Add Environment Variables (click "Environment Variables"):
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

5. Click **Deploy**

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? quicklearn-ai-frontend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🧪 Testing Your Deployment

### Test Backend
```bash
# Health check
curl https://YOUR-BACKEND-URL.vercel.app/health

# Welcome message
curl https://YOUR-BACKEND-URL.vercel.app/

# AI Explanation (should work with GROQ_API_KEY)
curl -X POST https://YOUR-BACKEND-URL.vercel.app/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"photosynthesis"}'
```

### Test Frontend
1. Open `https://YOUR-FRONTEND-URL.vercel.app`
2. Click "Sign in with Google"
3. Enter a topic (e.g., "black holes")
4. Verify you get a 1-minute explanation
5. Test favorites, history features

---

## 🔧 Troubleshooting

### Backend Issues

**500 Error**: Check Vercel function logs
- Dashboard → Your Project → Functions → View Logs

**Database Connection Failed**: 
- Verify DATABASE_URL format includes `?sslmode=require`
- Check Neon.tech database is active

**Redis Connection Failed**:
- Verify REDIS_URL starts with `rediss://` (double 's')
- Check Upstash instance is active

### Frontend Issues

**API calls failing**: 
- Verify NEXT_PUBLIC_API_URL doesn't have trailing slash
- Check CORS in backend (already configured)

**Google Sign-in not working**:
- Add frontend URL to Firebase authorized domains:
  - Firebase Console → Authentication → Settings → Authorized domains
  - Add: `your-frontend.vercel.app`

---

## 📊 Current Status

### Backend
- ✅ Deployed and running
- ✅ Health endpoint working
- ✅ AI models configured (15+ models)
- ✅ Firebase authentication ready
- ⏳ Database optional (works without)
- ⏳ Redis optional (works without)

### Frontend
- ⏳ Ready to deploy
- ✅ Firebase config ready
- ⏳ Needs backend URL update

### Features Working
- ✅ AI explanations (Groq API)
- ✅ Multi-model fallback
- ⏳ User authentication (needs frontend)
- ⏳ Caching (needs database)
- ⏳ Rate limiting (needs Redis)

---

## 📝 Summary

**Minimum viable deployment** (AI explanations work):
1. ✅ Backend deployed to Vercel
2. Update NEXT_PUBLIC_API_URL in frontend
3. Deploy frontend to Vercel
4. Test end-to-end

**Full production setup** (all features):
1. Add Neon.tech PostgreSQL
2. Add Upstash Redis
3. Update Vercel environment variables
4. Redeploy backend

---

## 🚀 Quick Start Command

```bash
# Get your backend URL first from Vercel dashboard
# Then update frontend .env.local with that URL
# Then deploy frontend with one command:

cd frontend
vercel --prod
```

---

## 💡 Tips

- **Free tier limits**:
  - Vercel: 100GB bandwidth/month (both projects)
  - Neon.tech: 512MB storage, 1 database
  - Upstash: 10k requests/day
  - Groq: Check your API key limits

- **Monitoring**: 
  - Vercel dashboard shows all requests, errors, function logs
  - Set up alerts in Vercel settings

- **Custom domain**: 
  - Add custom domain in Vercel project settings
  - Update Firebase authorized domains

**Need help?** Contact: s81868813@gmail.com
