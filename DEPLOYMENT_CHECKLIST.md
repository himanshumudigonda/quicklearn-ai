# 🚀 QuickLearn AI - Deployment Checklist

## ✅ Completed Tasks

- [x] Frontend redesigned with beautiful dark UI/UX
- [x] Framer Motion animations integrated
- [x] Tailwind CSS configured for dark theme
- [x] Firebase Authentication integrated
- [x] Backend API connected to frontend
- [x] State management fixed (Zustand)
- [x] Text-to-Speech functionality
- [x] Copy to clipboard feature
- [x] Favorites system (local storage)
- [x] Profile modal with nickname regeneration
- [x] Toast notifications
- [x] Loading states and skeletons
- [x] Responsive design (mobile + desktop)
- [x] Backend database fixed (pgcrypto extension)
- [x] Frontend running locally (http://localhost:3000)
- [x] Dependencies installed (npm install)
- [x] Documentation created

---

## 📋 Remaining Deployment Steps

### 1. Backend Deployment to Vercel

#### Step 1.1: Set Environment Variables in Vercel
Go to your Vercel project dashboard and add these environment variables:

**Critical Variables**:
```
NODE_ENV=production
DATABASE_URL=<your-postgresql-url>
REDIS_URL=<your-redis-url>
JWT_SECRET=<generate-a-strong-secret>
FIREBASE_ADMIN_JSON=<your-firebase-service-account-json>
GROQ_API_KEY=<your-groq-api-key>
```

**Optional Variables**:
```
OPENAI_API_KEY=<your-openai-key>
DEFAULT_MODEL=groq/compound-mini
VERIFICATION_MODEL=groq/compound
MAX_RETRIES=3
GLOBAL_RATE_LIMIT=10000
USER_RATE_LIMIT=200
CACHE_TTL_POPULAR=7776000
CACHE_TTL_NORMAL=604800
CACHE_TTL_VERIFIED=15552000
ADMIN_TOKEN=<generate-admin-token>
WORKER_CONCURRENCY=5
QUEUE_NAME=quicklearn-jobs
```

See `VERCEL_ENV_SETUP.md` for detailed instructions.

#### Step 1.2: Deploy Backend
```bash
cd backend
vercel login  # If not already logged in
vercel --prod
```

#### Step 1.3: Note Backend URL
After deployment, copy your backend URL (e.g., `https://quicklearn-backend.vercel.app`)

---

### 2. Update Frontend Configuration

#### Step 2.1: Update .env.local
Update the `NEXT_PUBLIC_API_URL` in `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

#### Step 2.2: Test Locally
```bash
cd frontend
npm run dev
```
Test the following:
- [ ] Sign in with Google works
- [ ] Search returns results from backend
- [ ] TTS works
- [ ] Copy to clipboard works
- [ ] Favorites work
- [ ] Nickname regeneration works
- [ ] Sign out works

---

### 3. Frontend Deployment to Netlify

#### Step 3.1: Build Frontend
```bash
cd frontend
npm run build
```

#### Step 3.2: Deploy to Netlify
**Option A: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Option B: Netlify Dashboard**
1. Go to Netlify dashboard
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Add environment variables (same as .env.local)
7. Deploy!

#### Step 3.3: Set Environment Variables in Netlify
Add these in Netlify > Site Settings > Environment Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

---

### 4. Configure Firebase

#### Step 4.1: Add Authorized Domains
1. Go to Firebase Console
2. Navigate to Authentication > Settings > Authorized domains
3. Add your Netlify domain (e.g., `your-app.netlify.app`)
4. Add your custom domain if you have one

#### Step 4.2: Update OAuth Redirect URIs
1. In Firebase Console > Authentication > Sign-in method
2. Click on Google provider
3. Add authorized redirect URIs:
   - `https://your-app.netlify.app`
   - `https://your-backend-url.vercel.app`

---

### 5. Database Setup

#### Option A: Supabase (Recommended)
1. Go to https://supabase.com
2. Create a new project
3. Get connection string from Settings > Database
4. Add to Vercel environment variables as `DATABASE_URL`

#### Option B: Neon
1. Go to https://neon.tech
2. Create a new project
3. Get connection string
4. Add to Vercel environment variables as `DATABASE_URL`

#### Option C: Railway
1. Go to https://railway.app
2. Create PostgreSQL database
3. Get connection string
4. Add to Vercel environment variables as `DATABASE_URL`

---

### 6. Redis Setup (Upstash)

1. Go to https://upstash.com
2. Create a new Redis database
3. Get connection string (Redis URL)
4. Add to Vercel environment variables as `REDIS_URL`

---

### 7. Final Testing

After all deployments, test the production app:

**Backend Tests**:
- [ ] Health check: `https://your-backend.vercel.app/health`
- [ ] Returns 200 OK with status information

**Frontend Tests**:
- [ ] Open `https://your-app.netlify.app`
- [ ] Sign in with Google
- [ ] Search for a topic (e.g., "Photosynthesis")
- [ ] Verify explanation displays correctly
- [ ] Test TTS (click speaker icon)
- [ ] Test copy to clipboard
- [ ] Test save to favorites (heart icon)
- [ ] Test nickname regeneration (profile modal)
- [ ] Test sign out
- [ ] Test on mobile device

**Integration Tests**:
- [ ] Login creates user in database
- [ ] Explanations are cached in Redis
- [ ] Popular topics endpoint works
- [ ] Verification request works
- [ ] Rate limiting works (try 201 requests)

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: 
1. Check `DATABASE_URL` is set in Vercel
2. Verify database is accessible
3. Check Vercel function logs for details

### Issue: "Firebase Auth error"
**Solution**:
1. Verify `FIREBASE_ADMIN_JSON` is properly formatted
2. Check Firebase authorized domains
3. Ensure frontend Firebase config is correct

### Issue: "Backend returns 500"
**Solution**:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test database connection
4. Check Redis connection

### Issue: "Frontend can't reach backend"
**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check CORS settings in backend
3. Ensure backend is deployed and running
4. Check browser console for errors

### Issue: "Google Sign-In fails"
**Solution**:
1. Check Firebase authorized domains
2. Verify Firebase config in frontend
3. Check browser console for specific error
4. Ensure popup blockers are disabled

---

## 📊 Monitoring

### Backend Monitoring (Vercel)
1. Go to Vercel dashboard
2. Check function logs for errors
3. Monitor response times
4. Check function invocation count

### Frontend Monitoring (Netlify)
1. Go to Netlify dashboard
2. Check deploy logs
3. Monitor bandwidth usage
4. Check form submissions (if any)

### Database Monitoring
1. Check your database provider dashboard
2. Monitor connection count
3. Check query performance
4. Monitor storage usage

### Redis Monitoring (Upstash)
1. Go to Upstash dashboard
2. Monitor command count
3. Check memory usage
4. Review cache hit rate

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Backend health check returns 200 OK
- ✅ Frontend loads without errors
- ✅ Google Sign-In works end-to-end
- ✅ Explanations are fetched and displayed
- ✅ All features work (TTS, copy, favorites, etc.)
- ✅ Mobile experience is smooth
- ✅ No console errors in browser
- ✅ Database connections are stable
- ✅ Redis caching is working

---

## 📈 Performance Optimization (Optional)

After successful deployment:
1. Enable Vercel Edge Functions for faster response times
2. Add CDN caching for static assets
3. Optimize images with Next.js Image component
4. Add service worker for offline support
5. Implement Redis caching for popular topics
6. Add database connection pooling
7. Monitor and optimize slow queries
8. Add error tracking (Sentry)
9. Add analytics (Google Analytics, Plausible)
10. Optimize bundle size

---

## 🔐 Security Checklist

- [ ] All API keys are in environment variables (not in code)
- [ ] Firebase security rules are configured
- [ ] Rate limiting is enabled on backend
- [ ] JWT secret is strong and secure
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)
- [ ] CORS is properly configured
- [ ] Database credentials are secure
- [ ] Admin token is strong
- [ ] No sensitive data in logs
- [ ] Error messages don't expose internal details

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Upstash Docs**: https://docs.upstash.com

---

## 🎯 Current Status

**Frontend**: ✅ Running locally at http://localhost:3000
**Backend**: ⏳ Ready for deployment to Vercel
**Database**: ⏳ Needs to be set up (Supabase/Neon/Railway)
**Redis**: ⏳ Needs to be set up (Upstash)

---

## 🚀 Next Action

**Immediate Next Step**: Deploy backend to Vercel
1. Set all environment variables in Vercel dashboard
2. Run `vercel --prod` from backend directory
3. Note the backend URL
4. Update frontend `.env.local` with backend URL
5. Test locally
6. Deploy frontend to Netlify

**Good luck! You're almost there! 🎉**
