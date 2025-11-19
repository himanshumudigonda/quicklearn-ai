# QuickLearn AI 🚀

> Learn anything in 1 minute with AI-powered explanations

QuickLearn AI is a privacy-focused educational platform that provides instant, concise, and high-quality explanations for any topic. Built with a multi-model fallback architecture to ensure reliability while keeping costs low.

## ✨ Features

- **Instant Explanations**: Get comprehensive 1-minute learning content
- **Privacy-First**: No search history stored, anonymous nicknames
- **Multi-Model Fallback**: Uses 15+ AI models with automatic failover (Groq, OpenAI)
- **Free TTS**: Device-based text-to-speech (no server cost)
- **Smart Caching**: Redis + Postgres + CDN for instant responses (90%+ cache hit rate)
- **Mobile & Web**: Cross-platform with offline support
- **Verified Answers**: Background verification with higher-tier models
- **Real-time**: Fast compound-mini model (500-1000ms responses)

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Cost Optimization](#cost-optimization)
- [Contributing](#contributing)

## 📚 Documentation

- **[MODELS.md](MODELS.md)** - Complete AI models catalog (15+ models)
- **[TESTING.md](TESTING.md)** - Testing guide and integration tests
- **[API.md](API.md)** - Full API reference
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[QUICKSTART.md](QUICKSTART.md)** - 10-minute setup guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture details

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│  Web/Mobile │─────▶│   Backend API    │─────▶│   Redis     │
│   Clients   │      │  (Node.js)       │      │   (Cache)   │
└─────────────┘      └──────────────────┘      └─────────────┘
                              │
                              ├──────────────────┐
                              ▼                  ▼
                     ┌─────────────┐    ┌──────────────┐
                     │  Postgres   │    │ Model Router │
                     │  (Persist)  │    │ (Fallback)   │
                     └─────────────┘    └──────────────┘
                                               │
                              ┌────────────────┼────────────────┐
                              ▼                ▼                ▼
                        ┌─────────┐     ┌─────────┐     ┌─────────┐
                        │  Groq   │     │ OpenAI  │     │  More   │
                        │ (Primary)│     │(Backup) │     │ Models  │
                        └─────────┘     └─────────┘     └─────────┘
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **PostgreSQL** - Persistent storage
- **Redis** - Hot cache & rate limiting
- **BullMQ** - Background job queue
- **Firebase Admin** - Authentication

### Frontend (Web)
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Web Speech API** - TTS

### Mobile
- **Expo** (React Native) - Cross-platform
- **SQLite** - Local cache
- **Expo Speech** - Device TTS

### AI Models
- Groq (compound-mini, llama-3.3-70b)
- OpenAI (GPT-4o-mini)
- Meta Llama 4 Scout
- Qwen 3, and more

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Firebase project (for auth)
- API keys: Groq, OpenAI

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# DATABASE_URL, REDIS_URL, GROQ_API_KEY, etc.

# Run migrations (tables auto-create on first run)
npm run dev

# In separate terminal, start worker
npm run worker
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
EOF

# Start development server
npm run dev
```

Visit http://localhost:3000 (adjust port if needed)

### Mobile Setup

```bash
cd mobile

# Install dependencies
npm install

# Update app.json with your API URL

# Start Expo
npm start

# Press 'a' for Android, 'i' for iOS, or scan QR code
```

## 🌐 Deployment

> Note (2025-11-19): Netlify config updated to rely on the official Next.js plugin. Do not add a catch-all SPA redirect (/* -> /index.html) or Next.js assets (/_next/*) will not load.

### Render (Recommended)

1. **Fork/Clone** this repository
2. **Connect to Render**: Import repo in Render dashboard
3. **Use Blueprint**: Render will detect `render.yaml`
4. **Add Environment Variables**:
   - `GROQ_API_KEY`
   - `OPENAI_API_KEY`
   - `FIREBASE_ADMIN_JSON`
5. **Deploy**: Automatic deployment starts

### Manual Deployment

#### Backend

```bash
# Build
cd backend
npm install --production

# Set environment variables
export DATABASE_URL=postgresql://...
export REDIS_URL=redis://...
# ... (all other vars)

# Start services
npm start          # API
npm run worker     # Background jobs
```

#### Frontend

```bash
cd frontend
npm install
npm run build
npm start
```

### Vercel (Frontend Alternative)

```bash
cd frontend
vercel
# Follow prompts, add env vars in Vercel dashboard
```

## 📚 API Documentation

### Authentication

#### POST `/api/auth/login`

```json
{
  "idToken": "firebase_id_token"
}
```

**Response:**
```json
{
  "sessionToken": "jwt_token",
  "nickname": "Turbo-Papaya-042",
  "avatarSeed": "12345"
}
```

### Explanations

#### POST `/api/explain`

```json
{
  "topic": "photosynthesis",
  "user_id": "optional",
  "force_verify": false
}
```

**Response:**
```json
{
  "topic": "photosynthesis",
  "source": "cache|groq/compound-mini",
  "content": {
    "one_line": "Process plants use to make food from sunlight",
    "explanation": "...",
    "analogy": "...",
    "example": "...",
    "formula": "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
    "revision_note": "..."
  },
  "cached": true,
  "responseTime": 45
}
```

### Verification

#### POST `/api/verify`

Request verification with higher-tier models

```json
{
  "topic": "quantum entanglement",
  "user_id": "optional",
  "priority": "normal|high"
}
```

### Topics

#### GET `/api/topics/popular?limit=50`

Get popular topics

#### GET `/api/topics/search?q=dna`

Search topics

## 📁 Project Structure

```
quicklearn-ai/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Model router, providers
│   │   ├── db/              # Database setup
│   │   ├── cache/           # Redis operations
│   │   ├── middleware/      # Auth, rate limit, errors
│   │   ├── utils/           # Helpers, validation
│   │   ├── server.js        # Express app
│   │   └── worker.js        # Background worker
│   └── package.json
├── frontend/
│   ├── pages/               # Next.js pages
│   ├── components/          # React components
│   ├── lib/                 # API, auth, utils
│   ├── styles/              # CSS
│   └── package.json
├── mobile/
│   ├── screens/             # App screens
│   ├── lib/                 # API, DB, TTS
│   ├── App.js
│   └── package.json
├── render.yaml              # Deployment config
└── README.md
```

## 💰 Cost Optimization

### Strategies

1. **Caching**:
   - Redis hot cache (7-180 days TTL)
   - Postgres persistent cache
   - CDN for precomputed topics

2. **Model Fallback**:
   - Primary: Groq compound-mini (fast, cheap)
   - Backup: Higher models only when needed
   - Skip exhausted models automatically

3. **Precomputation**:
   - 2,000+ popular topics pre-generated
   - Served from cache/CDN (near-zero cost)

4. **Rate Limiting**:
   - Soft per-user limits (invisible)
   - Global throttle prevents quota exhaustion

5. **Background Verification**:
   - Heavy jobs processed off-peak
   - User gets instant draft, verified later

### Expected Costs

- **Render**: $7-25/month (Starter plan)
- **Database**: Included or $7/month
- **Redis**: Included or Upstash free tier
- **AI Models**: ~$10-50/month (10K requests)
- **Total**: **~$25-80/month** for thousands of users

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests (Playwright)
npm run test:e2e
```

## 📊 Monitoring

### Admin Dashboard

Access at `/api/admin/*` with admin token:

- **GET** `/api/admin/stats` - System metrics
- **GET** `/api/admin/top-topics` - Most used topics
- **GET** `/api/admin/recent-jobs` - Job queue status

Set header: `X-Admin-Token: your_admin_token`

### Logs

- Backend: Winston logger (console + files)
- Errors: Sentry integration ready
- Metrics: Prometheus/Grafana compatible

## 🔐 Security

- Firebase ID token verification
- JWT session tokens (30-day expiry)
- Rate limiting (token bucket)
- Input sanitization (prompt injection protection)
- No PII storage (only Google UID + anonymous nickname)
- HTTPS enforced in production

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- AI models: Groq, OpenAI, Meta, Qwen
- UI inspiration: Modern education platforms
- Icons: Lucide, Ionicons

## 📞 Support & Feedback

- **Issues**: [GitHub Issues](https://github.com/himanshumudigonda/quicklearn-ai/issues)
- **Email**: s81868813@gmail.com
- **Feedback**: Send suggestions, bug reports, or feature requests to s81868813@gmail.com

---

Built with ❤️ for students worldwide
