# QuickLearn AI - Quick Start Guide

Get your QuickLearn AI app running in under 10 minutes!

## 🚀 Prerequisites

- Node.js 18+ installed
- PostgreSQL running locally (or use Docker)
- Redis running locally (or use Docker)
- Firebase project created
- Groq API key (sign up at groq.com)

---

## ⚡ Fast Setup (Local Development)

### 1. Start PostgreSQL & Redis (Docker - Easiest)

```bash
# PostgreSQL
docker run --name quicklearn-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=quicklearn -p 5432:5432 -d postgres:14

# Redis
docker run --name quicklearn-redis -p 6379:6379 -d redis:7
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/quicklearn
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-this
ADMIN_TOKEN=admin-token-change-this
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=sk-optional
FIREBASE_ADMIN_JSON='{"type":"service_account","project_id":"your-project"}'
EOF

# Start backend
npm run dev

# In another terminal, start worker
npm run worker
```

Backend now running at http://localhost:3000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EOF

# Start frontend
npm run dev
```

Frontend now running at http://localhost:3001 (or 3000 if backend is on different port)

### 4. Mobile Setup (Optional)

```bash
cd mobile

# Install dependencies
npm install

# Update app.json
# Change "apiUrl" in "extra" to "http://YOUR_LOCAL_IP:3000"

# Start Expo
npm start

# Scan QR code with Expo Go app on your phone
```

---

## 🔥 Test It Out

1. Open http://localhost:3001 in your browser
2. Search for "photosynthesis"
3. Get instant explanation!
4. Try the Read Aloud button (device TTS)
5. Save to favorites

---

## 🎯 Common Issues & Fixes

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
docker ps

# Check connection
psql postgresql://postgres:password@localhost:5432/quicklearn
```

### "Redis connection failed"
```bash
# Check if Redis is running
redis-cli ping
# Should respond: PONG
```

### "Model API error"
- Check your GROQ_API_KEY is valid
- Sign up at groq.com if you don't have one
- Free tier: 30 requests/minute

### "Firebase auth error"
- Create Firebase project at console.firebase.google.com
- Enable Google Sign-In in Authentication
- Download service account JSON
- Add to FIREBASE_ADMIN_JSON in backend .env
- Add web config to frontend .env.local

---

## 📊 Access Admin Dashboard

1. Get your ADMIN_TOKEN from backend/.env
2. Visit http://localhost:3001/admin
3. Enter admin token
4. View stats, model usage, top topics

---

## 🧪 Quick Test Commands

```bash
# Health check
curl http://localhost:3000/health

# Get explanation
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"gravity"}'

# Popular topics
curl http://localhost:3000/api/topics/popular?limit=10

# Admin stats (replace TOKEN)
curl http://localhost:3000/api/admin/stats \
  -H "X-Admin-Token: admin-token-change-this"
```

---

## 🔧 Optional Enhancements

### Seed Popular Topics

```bash
cd backend
node scripts/seedTopics.js
```

### Enable Additional Models

Add to backend/.env:
```
OPENAI_API_KEY=sk-your-openai-key
QWEN_API_KEY=your-qwen-key
MOONSHOTAI_API_KEY=your-moonshot-key
```

---

## 🚢 Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guide.

**Quick Deploy to Render:**
1. Push code to GitHub
2. Connect to Render
3. It auto-detects render.yaml
4. Add env vars
5. Deploy! ✅

---

## 📚 Next Steps

- Read [API.md](API.md) for API documentation
- Check [README.md](README.md) for architecture details
- Explore code in `backend/src/` and `frontend/`
- Customize prompts in `backend/src/utils/prompts.js`
- Add more models in `backend/src/services/modelRouter.js`

---

## 🆘 Need Help?

- Check logs: `backend/logs/`
- GitHub Issues: [Report a bug](#)
- Discord: [Join community](#)
- Email: support@quicklearn.ai

---

**Happy Learning! 🎓✨**
