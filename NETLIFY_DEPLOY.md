# Netlify Frontend Deployment - Complete Guide

## What You'll Upload
✅ Your **GitHub repository** (Netlify will auto-deploy from it)  
✅ No manual file upload needed!

---

## Step-by-Step Netlify Deployment

### Step 1: Create Netlify Configuration

First, I'll create the config file for you. This tells Netlify how to build your app.

**File**: `frontend/netlify.toml`

### Step 2: Get Your Backend URL

1. Go to **https://vercel.com/dashboard**
2. Click your backend project
3. Copy the URL at the top (e.g., `https://your-project.vercel.app`)

### Step 3: Deploy on Netlify

#### Option A: Via Netlify Website (Easiest)

1. Go to **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select repository: **`himanshumudigonda/quicklearn-ai`**

6. **Configure build settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`

7. **Add environment variables** (click "Show advanced" → "New variable"):
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
   ⚠️ Replace `YOUR-BACKEND-URL` with your actual Vercel backend URL!

8. Click **"Deploy site"**
9. Wait 2-3 minutes ⏱️

#### Option B: Via Netlify CLI (Faster)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to frontend
cd frontend

# Deploy
netlify deploy --prod

# Follow prompts
```

---

## After Deployment

### 1. Get Your Frontend URL
- Netlify will show: `https://random-name-123.netlify.app`
- You can change it: Site settings → Domain management → Change site name

### 2. Update Firebase Authorized Domains
1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select project: **quicklearn-ai-ba56b**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add your Netlify URL: `your-app-name.netlify.app`
6. Click **"Add"**

### 3. Test Your App
1. Open your Netlify URL
2. Click **"Sign in with Google"**
3. Enter a topic: "photosynthesis"
4. Verify AI explanation appears
5. Test favorites, history

---

## What Files Get Deployed?

Netlify automatically deploys:
- ✅ All files in `frontend/` folder
- ✅ Builds Next.js app
- ✅ Serves static files + API routes
- ✅ Auto-updates when you push to GitHub

**You don't upload files manually** - Netlify connects to your GitHub repo!

---

## Environment Variables You Need

Copy these to Netlify (replace YOUR-BACKEND-URL):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDi9wkFjgmeB_hcKG1yaZJ2Q5-1K_uwx9A
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quicklearn-ai-ba56b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quicklearn-ai-ba56b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quicklearn-ai-ba56b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1096155237120
NEXT_PUBLIC_FIREBASE_APP_ID=1:1096155237120:web:a51c52a9b1cd5c9d4a01e5
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-J0YQ32L4ZS
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app
```

---

## Netlify Build Settings

When configuring on Netlify, use these exact settings:

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/.next` |
| **Node version** | 18 or higher |

---

## Troubleshooting

### Build fails with "command not found"
- Check base directory is set to `frontend`
- Verify `package.json` exists in frontend folder

### "Firebase not initialized"
- Verify all NEXT_PUBLIC_FIREBASE_* variables are added
- Check no typos in variable names

### API calls failing
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend is deployed on Vercel
- Test backend: `curl https://your-backend.vercel.app/health`

### Google Sign-in not working
- Add Netlify domain to Firebase authorized domains
- Wait 5 minutes for Firebase to propagate changes

---

## Quick Start Commands

```bash
# 1. Get your Vercel backend URL
# (from Vercel dashboard)

# 2. Go to Netlify
https://app.netlify.com

# 3. Import from GitHub
# Select: himanshumudigonda/quicklearn-ai
# Base dir: frontend
# Add all environment variables
# Deploy!

# That's it! 🚀
```

---

## Summary Checklist

- [ ] Get Vercel backend URL
- [ ] Go to https://app.netlify.com
- [ ] Connect GitHub repository
- [ ] Set base directory to `frontend`
- [ ] Add all 8 environment variables
- [ ] Click "Deploy site"
- [ ] Wait for build to complete
- [ ] Add Netlify URL to Firebase authorized domains
- [ ] Test the app!

**Total time: ~10 minutes**

---

## Free Tier Limits

Netlify Free Plan:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Custom domain support

**Perfect for your QuickLearn AI app!**

---

**Need Help?** Contact: s81868813@gmail.com
