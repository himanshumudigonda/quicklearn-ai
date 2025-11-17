# Deploy to Vercel - Quick Guide

## ✅ What's Ready

Your backend is now configured for Vercel serverless deployment!

## 🚀 Deploy Steps (5 minutes)

### 1. Go to Vercel
Visit: https://vercel.com/new

### 2. Import Your Repository
- Click **"Import Git Repository"**
- Select **"GitHub"**
- Find and select: `himanshumudigonda/quicklearn-ai`
- Click **"Import"**

### 3. Configure Project
Vercel will auto-detect Next.js. Configure as follows:

**Framework Preset**: Other
**Root Directory**: Leave empty (or select root)
**Build Command**: `cd backend && npm install`
**Output Directory**: Leave empty
**Install Command**: `npm install`

### 4. Add Environment Variables

Click **"Environment Variables"** and add these:

```
NODE_ENV=production
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
FIREBASE_ADMIN_JSON=your_firebase_admin_json_here
```

**Note**: Get your actual values from:
- GROQ_API_KEY: From your local `backend/.env` file
- FIREBASE_ADMIN_JSON: From your Firebase console (Service Accounts)

**For Database** (get from Neon.tech - free):
```
DATABASE_URL=postgresql://...
```

**For Redis** (get from Upstash - free):
```
REDIS_URL=redis://...
```

### 5. Get Free Database (Neon.tech)

1. Go to: https://neon.tech
2. Sign up (free)
3. Create new project: "QuickLearn AI"
4. Copy connection string
5. Add to Vercel as `DATABASE_URL`

### 6. Get Free Redis (Upstash)

1. Go to: https://upstash.com
2. Sign up (free)
3. Create Redis database
4. Copy connection string
5. Add to Vercel as `REDIS_URL`

### 7. Deploy!

Click **"Deploy"** and wait 2-3 minutes!

Your backend will be live at: `https://quicklearn-ai-xxx.vercel.app`

### 8. Test Your Backend

```bash
curl https://your-app.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-17T...",
  "uptime": 123
}
```

Test AI explanation:
```bash
curl -X POST https://your-app.vercel.app/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic": "photosynthesis"}'
```

## ✅ What You Get (FREE)

- ✅ Backend API live 24/7
- ✅ Global edge network (fast)
- ✅ Auto-scaling
- ✅ SSL certificate
- ✅ 100GB bandwidth/month
- ✅ Automatic deployments from GitHub

## 🎯 Next Steps

After backend is deployed:

1. **Deploy Frontend** to Vercel too
   - Create new project in Vercel
   - Select `frontend` folder
   - Add frontend env variables
   - Deploy!

2. **Update Frontend API URL**
   - In `frontend/.env.local`
   - Change `NEXT_PUBLIC_API_URL` to your Vercel backend URL

## 💡 Notes

- **Free database**: Neon.tech gives 512MB free
- **Free Redis**: Upstash gives 10k requests/day free
- **No credit card** required for any service
- **Auto-deploy**: Push to GitHub = auto-deploy to Vercel

## 🐛 Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Ensure all strings are properly escaped

**Database connection issues?**
- Verify DATABASE_URL is correct
- Check Neon.tech database is active

**Redis connection issues?**
- Verify REDIS_URL is correct
- Check Upstash Redis is active

---

**Need help?** Email: s81868813@gmail.com

🚀 Your backend will be live in minutes!
