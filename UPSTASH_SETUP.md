# Upstash Redis Setup - Step by Step Guide

## What is Upstash Redis?
- Free Redis database (10,000 requests/day)
- Used for: Rate limiting, hot cache for popular topics, model counters
- Zero maintenance, serverless Redis

---

## Step-by-Step Setup (5 minutes)

### Step 1: Create Account

1. Go to: **https://upstash.com**
2. Click **"Sign Up"** or **"Get Started"**
3. Choose sign-up method:
   - **GitHub** (recommended - instant)
   - Email
   - Google

### Step 2: Create Redis Database

1. After login, you'll see the dashboard
2. Click **"Create Database"** button
3. Fill in the form:
   - **Name**: `quicklearn-ai-cache`
   - **Type**: Select **"Regional"** (free tier)
   - **Region**: Choose closest to your Vercel region:
     - **US East (Virginia)** - `us-east-1` (recommended for most)
     - **Europe (Ireland)** - `eu-west-1`
     - **Asia Pacific (Tokyo)** - `ap-northeast-1`
   - **Eviction**: Keep default (allkeys-lru)
   - **TLS**: Keep enabled (default)
4. Click **"Create"**

⏱️ Database creates instantly!

### Step 3: Get Connection String

After creation, you'll see the database details page:

1. Scroll down to **"REST API"** section (not "Connection" section)
2. You'll see several options. Copy the **"UPSTASH_REDIS_REST_URL"**
   - Format: `https://xxxxx.upstash.io`
   
3. **ALTERNATIVE** - For traditional Redis connection:
   - Scroll to **"Connect"** section at the top
   - Copy **"Redis URL"** 
   - Format: `rediss://default:xxxxx@xxxxx.upstash.io:6379`

**Copy this URL** - you'll need it for Vercel!

### Step 4: Add to Vercel Backend

1. Go to: **https://vercel.com/dashboard**
2. Click on your **backend project** (quicklearn-ai or similar)
3. Click **"Settings"** tab (top navigation)
4. Click **"Environment Variables"** (left sidebar)
5. Click **"Add New"** button

6. Add the variable:
   - **Key**: `REDIS_URL`
   - **Value**: Paste your Upstash Redis URL (the one starting with `rediss://`)
   - **Environment**: Select all (Production, Preview, Development)
   
7. Click **"Save"**

### Step 5: Redeploy Backend

1. Go to **"Deployments"** tab (top navigation)
2. Click the three dots **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait ~2 minutes for redeployment

✅ **Done!** Your backend now has Redis caching and rate limiting.

---

## Verify It's Working

### Option 1: Check Vercel Logs
1. Go to **Deployments** → Click latest deployment
2. Click **"Functions"** tab
3. Click on your function → **"View Logs"**
4. Look for: `Redis connected` message

### Option 2: Test API
```bash
# Replace with your backend URL
curl https://your-backend.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 0.5,
  "env": "production",
  "vercel": true
}
```

---

## What Redis Enables

Once configured, your backend will use Redis for:

1. **Rate Limiting**:
   - Global: 10,000 requests/hour
   - Per user: 200 requests/hour
   - Prevents API abuse

2. **Hot Cache**:
   - Popular topics cached for fast responses
   - Reduces AI API calls
   - Saves costs

3. **Model Counters**:
   - Track which AI models are used most
   - Analytics for optimization

4. **Session Management**:
   - Quick user session lookups
   - Fast authentication checks

---

## Upstash Dashboard Tips

### View Your Data
1. Go to Upstash dashboard
2. Click your database name
3. Click **"Data Browser"** tab
4. You'll see all cached keys and values

### Monitor Usage
- Dashboard shows:
  - Total requests today
  - Storage used
  - Peak requests per second
  - Free tier: 10k requests/day

### Connection Details
- **Endpoint**: Shows your Redis URL
- **Port**: 6379 (default Redis port)
- **Password**: Included in connection string
- **TLS**: Always enabled for security

---

## Troubleshooting

### "Connection failed" in logs
- ✅ Verify REDIS_URL starts with `rediss://` (with double 's')
- ✅ Check Upstash database is "Active" in dashboard
- ✅ Make sure you copied the full URL including password

### "Rate limit exceeded" on Upstash
- Free tier: 10k requests/day
- Check dashboard for usage
- Upgrade to paid plan if needed (starts at $0.2 per 100k requests)

### Backend works without Redis
- Redis is **optional**
- Backend gracefully skips Redis if not configured
- You'll see: `Skipping Redis connection` in logs

---

## Free Tier Limits

Upstash Free Forever Plan:
- ✅ 10,000 requests per day
- ✅ 256 MB storage
- ✅ TLS encryption
- ✅ Global replication (optional)
- ✅ No credit card required

**Plenty for your QuickLearn AI app!**

---

## Summary Checklist

- [ ] Created Upstash account
- [ ] Created Redis database: `quicklearn-ai-cache`
- [ ] Copied Redis URL (starts with `rediss://`)
- [ ] Added `REDIS_URL` to Vercel backend environment variables
- [ ] Redeployed backend
- [ ] Verified "Redis connected" in logs

**Next Step**: Deploy frontend or test your API!

---

## Quick Reference

**Upstash Dashboard**: https://console.upstash.com
**Documentation**: https://docs.upstash.com/redis
**Vercel Dashboard**: https://vercel.com/dashboard

**Your Redis URL Format**:
```
rediss://default:YOUR_PASSWORD@YOUR_ENDPOINT.upstash.io:6379
```

**Need Help?** Contact: s81868813@gmail.com
