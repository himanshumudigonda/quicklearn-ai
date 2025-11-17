# QuickLearn AI - Setup Checklist

Complete this checklist to ensure everything is properly configured.

## ✅ Pre-Installation Checklist

### System Requirements
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] PostgreSQL 14+ installed or Docker available
- [ ] Redis 6+ installed or Docker available
- [ ] Code editor (VS Code recommended)

### Accounts & API Keys
- [ ] GitHub account created
- [ ] Firebase project created (console.firebase.google.com)
  - [ ] Authentication enabled
  - [ ] Google sign-in provider enabled
  - [ ] Service account JSON downloaded
- [ ] Groq account created (groq.com)
  - [ ] API key obtained
- [ ] Optional: OpenAI account (openai.com)
  - [ ] API key obtained
- [ ] Optional: Render account (render.com)

---

## 🔧 Installation Checklist

### Database Setup
- [ ] PostgreSQL running
  ```bash
  # Test connection
  psql -U postgres -c "SELECT version();"
  ```
- [ ] Database created (`quicklearn`)
- [ ] Redis running
  ```bash
  # Test connection
  redis-cli ping
  # Should respond: PONG
  ```

### Backend Setup
- [ ] Navigate to backend folder (`cd backend`)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] Environment variables configured:
  - [ ] `DATABASE_URL`
  - [ ] `REDIS_URL`
  - [ ] `JWT_SECRET`
  - [ ] `ADMIN_TOKEN`
  - [ ] `GROQ_API_KEY`
  - [ ] `FIREBASE_ADMIN_JSON`
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Health endpoint works (`curl http://localhost:3000/health`)
- [ ] Worker starts without errors (`npm run worker`)

### Frontend Setup
- [ ] Navigate to frontend folder (`cd frontend`)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created
- [ ] Environment variables configured:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access at http://localhost:3001

### Mobile Setup (Optional)
- [ ] Navigate to mobile folder (`cd mobile`)
- [ ] Dependencies installed (`npm install`)
- [ ] Expo CLI installed globally (`npm install -g expo-cli`)
- [ ] `app.json` updated with correct API URL
- [ ] App starts without errors (`npm start`)
- [ ] Can scan QR code with Expo Go app

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Health check works
  ```bash
  curl http://localhost:3000/health
  ```
- [ ] Explanation endpoint works
  ```bash
  curl -X POST http://localhost:3000/api/explain \
    -H "Content-Type: application/json" \
    -d '{"topic":"test"}'
  ```
- [ ] Popular topics endpoint works
  ```bash
  curl http://localhost:3000/api/topics/popular?limit=5
  ```
- [ ] Database connection successful (check logs)
- [ ] Redis connection successful (check logs)
- [ ] Worker processing jobs (check logs)

### Frontend Tests
- [ ] Page loads without errors
- [ ] Can type in search bar
- [ ] Search returns results
- [ ] Results display properly
- [ ] Copy button works
- [ ] Download button works
- [ ] Read Aloud button works (browser TTS)
- [ ] Profile button shows (or sign-in)
- [ ] Admin page accessible at /admin

### Integration Tests
- [ ] Google sign-in works
- [ ] Explanation saved to database
- [ ] Explanation cached in Redis
- [ ] Verification job created
- [ ] Worker processes verification
- [ ] Favorites saved locally (frontend)

### Mobile Tests (if setup)
- [ ] App launches successfully
- [ ] Search works
- [ ] Results display
- [ ] Offline cache works
- [ ] Device TTS works
- [ ] Share functionality works

---

## 🔐 Security Checklist

### Credentials
- [ ] `.env` files NOT committed to git
- [ ] `.env` added to `.gitignore`
- [ ] Strong JWT_SECRET generated
- [ ] Strong ADMIN_TOKEN generated
- [ ] Firebase service account JSON secured
- [ ] API keys not exposed in frontend code

### Access Control
- [ ] Admin endpoints require token
- [ ] Rate limiting enabled
- [ ] Firebase authentication working
- [ ] User input sanitized

---

## 📊 Admin Dashboard Checklist

- [ ] Can access /admin page
- [ ] Admin token authentication works
- [ ] Stats display correctly:
  - [ ] User count
  - [ ] Explanation count
  - [ ] Cache keys
  - [ ] Model usage
- [ ] Top topics table loads
- [ ] Recent jobs table loads
- [ ] Data refreshes automatically (30s)

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All local tests passing
- [ ] Documentation reviewed
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Seed data prepared (`npm run seed`)

### Render Deployment
- [ ] Code pushed to GitHub
- [ ] Repository connected to Render
- [ ] `render.yaml` detected
- [ ] Environment variables added in Render:
  - [ ] `GROQ_API_KEY`
  - [ ] `OPENAI_API_KEY` (optional)
  - [ ] `FIREBASE_ADMIN_JSON`
- [ ] Database created
- [ ] Redis instance created
- [ ] Services deployed:
  - [ ] Backend API service
  - [ ] Worker service
- [ ] Health check passes on deployed URL

### Post-Deployment
- [ ] API accessible at production URL
- [ ] Test explanation endpoint
- [ ] Test admin dashboard
- [ ] Monitor logs for errors
- [ ] Check database has data
- [ ] Verify Redis working
- [ ] Test Google sign-in on production

### Frontend Deployment (Vercel)
- [ ] Frontend connected to Vercel
- [ ] Environment variables added
- [ ] Production build successful
- [ ] Site accessible
- [ ] API connection working
- [ ] Firebase auth working

---

## 📈 Post-Launch Checklist

### Monitoring
- [ ] Health checks set up
- [ ] Error tracking configured (Sentry)
- [ ] Analytics added (Google Analytics)
- [ ] Logging working properly
- [ ] Alerts configured:
  - [ ] Service downtime
  - [ ] High error rate
  - [ ] Database issues

### Performance
- [ ] Cache hit rate >80%
- [ ] Average response time <500ms
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Rate limiting working

### Documentation
- [ ] README updated with production URLs
- [ ] API documentation current
- [ ] Deployment guide accurate
- [ ] Known issues documented
- [ ] Changelog started

### User Experience
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify TTS works
- [ ] Check all buttons/links
- [ ] Ensure error messages clear

---

## 🎯 Optional Enhancements Checklist

### Features
- [ ] Add more AI models
- [ ] Implement dark mode
- [ ] Add multilingual support
- [ ] Create mobile app stores listing
- [ ] Add social sharing
- [ ] Implement spaced repetition
- [ ] Add quiz generation

### Infrastructure
- [ ] Set up staging environment
- [ ] Configure CI/CD pipeline
- [ ] Add automated tests
- [ ] Set up database backups
- [ ] Configure CDN (Cloudflare)
- [ ] Add load balancer

### Business
- [ ] Analytics tracking user behavior
- [ ] Feedback collection system
- [ ] Email notification system
- [ ] Payment integration (if monetizing)
- [ ] Terms of service
- [ ] Privacy policy

---

## ✅ Final Verification

Run through this final check before considering setup complete:

### Locally
```bash
# Backend health
curl http://localhost:3000/health

# Explanation works
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"photosynthesis"}'

# Frontend accessible
open http://localhost:3001

# Admin dashboard
open http://localhost:3001/admin
```

### Production
```bash
# Replace YOUR_DOMAIN with actual domain

# Backend health
curl https://YOUR_DOMAIN/health

# Explanation works
curl -X POST https://YOUR_DOMAIN/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"photosynthesis"}'

# Frontend accessible
open https://your-frontend-domain.com

# Admin dashboard
open https://your-frontend-domain.com/admin
```

---

## 🎉 Completion

When all items are checked:

- [ ] **Local Development**: ✅ Complete
- [ ] **Testing**: ✅ All tests pass
- [ ] **Security**: ✅ Properly configured
- [ ] **Deployment**: ✅ Live on production
- [ ] **Monitoring**: ✅ Tracking enabled
- [ ] **Documentation**: ✅ Up to date

**Congratulations! Your QuickLearn AI is ready!** 🚀

---

## 📞 Troubleshooting

If any checklist item fails:

1. Check the relevant documentation:
   - Installation issues → [QUICKSTART.md](QUICKSTART.md)
   - Deployment issues → [DEPLOYMENT.md](DEPLOYMENT.md)
   - API issues → [API.md](API.md)

2. Review logs:
   ```bash
   # Backend logs
   cd backend && tail -f logs/combined.log
   
   # Render logs
   render logs -s quicklearn-backend -f
   ```

3. Common fixes:
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Restart services: `pkill node && npm run dev`
   - Reset database: Drop and recreate tables

4. Still stuck? Open a GitHub issue with:
   - Checklist item that failed
   - Error messages
   - Steps to reproduce
   - Environment details

---

**Last Updated**: 2024-01-15
**Checklist Version**: 1.0.0
