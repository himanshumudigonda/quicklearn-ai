# QuickLearn AI - Complete Project Structure

```
quicklearn-ai/
│
├── backend/                          # Node.js/Express Backend
│   ├── src/
│   │   ├── routes/                  # API Endpoints
│   │   │   ├── index.js             # Route aggregator
│   │   │   ├── auth.js              # Google sign-in, nickname/avatar
│   │   │   ├── explain.js           # Main explanation endpoint
│   │   │   ├── verify.js            # Verification jobs
│   │   │   ├── topics.js            # Popular/recent/search topics
│   │   │   ├── feedback.js          # User feedback
│   │   │   └── admin.js             # Admin dashboard endpoints
│   │   │
│   │   ├── services/                # Business Logic
│   │   │   ├── modelRouter.js       # Multi-model fallback logic
│   │   │   └── providers/           # Model integrations
│   │   │       ├── groq.js          # Groq API integration
│   │   │       └── openai.js        # OpenAI API integration
│   │   │
│   │   ├── db/                      # Database
│   │   │   └── index.js             # PostgreSQL setup & queries
│   │   │
│   │   ├── cache/                   # Caching Layer
│   │   │   └── index.js             # Redis operations & helpers
│   │   │
│   │   ├── middleware/              # Express Middleware
│   │   │   ├── errorHandler.js     # Global error handling
│   │   │   └── rateLimit.js        # Rate limiting (global + user)
│   │   │
│   │   ├── utils/                   # Utilities
│   │   │   ├── logger.js            # Winston logger
│   │   │   ├── nickname.js          # Nickname & avatar generation
│   │   │   ├── prompts.js           # AI prompt templates
│   │   │   └── validation.js        # Input validation & schemas
│   │   │
│   │   ├── server.js                # Express app entry point
│   │   └── worker.js                # Background job worker
│   │
│   ├── scripts/
│   │   └── seedTopics.js            # Precompute popular topics
│   │
│   ├── package.json                 # Dependencies
│   ├── .env.example                 # Environment template
│   └── README.md                    # Backend docs
│
├── frontend/                         # Next.js Web App
│   ├── pages/
│   │   ├── _app.js                  # App wrapper (global state)
│   │   ├── _document.js             # HTML document structure
│   │   ├── index.js                 # Home page (search + results)
│   │   └── admin.js                 # Admin dashboard
│   │
│   ├── components/                  # React Components
│   │   ├── SearchBar.js             # Search input with suggestions
│   │   ├── ResultCard.js            # Explanation display
│   │   ├── ProfileButton.js         # User profile menu
│   │   └── PopularTopics.js         # Trending topics grid
│   │
│   ├── lib/                         # Frontend Logic
│   │   ├── api.js                   # API client (axios)
│   │   ├── auth.js                  # Google sign-in helpers
│   │   ├── firebase.js              # Firebase config
│   │   ├── store.js                 # Zustand state management
│   │   └── utils.js                 # TTS, clipboard, download
│   │
│   ├── styles/
│   │   └── globals.css              # Tailwind + custom styles
│   │
│   ├── public/                      # Static assets (favicon, etc.)
│   ├── package.json
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── .env.example                 # Environment template
│
├── mobile/                           # Expo React Native App
│   ├── screens/
│   │   ├── HomeScreen.js            # Search & popular topics
│   │   ├── ResultScreen.js          # Explanation display
│   │   └── ProfileScreen.js         # User profile & favorites
│   │
│   ├── lib/                         # Mobile Logic
│   │   ├── api.js                   # API client
│   │   ├── database.js              # SQLite local storage
│   │   ├── tts.js                   # Expo Speech TTS
│   │   └── utils.js                 # Avatar, time formatting
│   │
│   ├── assets/                      # Images, icons, fonts
│   ├── App.js                       # Root component
│   ├── app.json                     # Expo configuration
│   ├── package.json
│   └── README.md
│
├── docs/                             # Documentation (optional)
│   ├── architecture.md
│   ├── api-reference.md
│   └── contributing.md
│
├── .github/                          # GitHub Configuration
│   └── workflows/
│       └── deploy.yml               # CI/CD (optional)
│
├── README.md                         # Main project documentation
├── QUICKSTART.md                     # Quick setup guide
├── DEPLOYMENT.md                     # Deployment instructions
├── API.md                            # API reference
├── LICENSE                           # MIT License
├── .gitignore                        # Git ignore rules
└── render.yaml                       # Render deployment config
```

## 📊 Component Overview

### Backend Architecture

```
Client Request
    ↓
Express Server (src/server.js)
    ↓
Rate Limiter (middleware/rateLimit.js)
    ↓
Route Handler (routes/explain.js)
    ↓
Cache Check (cache/index.js - Redis)
    ↓ (miss)
Database Check (db/index.js - Postgres)
    ↓ (miss)
Model Router (services/modelRouter.js)
    ↓
Provider (groq.js / openai.js)
    ↓
AI Model (Groq Compound Mini)
    ↓
Validation (utils/validation.js)
    ↓
Save to DB & Cache
    ↓
Return Response
```

### Frontend Flow

```
User Input (SearchBar.js)
    ↓
API Call (lib/api.js)
    ↓
State Update (lib/store.js - Zustand)
    ↓
Result Display (ResultCard.js)
    ↓
Actions:
  - Read Aloud (lib/utils.js - Web Speech API)
  - Copy to Clipboard
  - Download
  - Save to Favorites
```

### Mobile Flow

```
User Input (HomeScreen.js)
    ↓
Check Local Cache (lib/database.js - SQLite)
    ↓ (miss)
API Call (lib/api.js)
    ↓
Save to Cache
    ↓
Display (ResultScreen.js)
    ↓
Actions:
  - Read Aloud (lib/tts.js - Expo Speech)
  - Share
  - Add to Favorites
```

## 🔑 Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `server.js` | Express app setup, middleware, routes |
| `worker.js` | Background job processor (BullMQ) |
| `modelRouter.js` | Multi-model fallback strategy |
| `prompts.js` | AI prompt templates for explanations |
| `nickname.js` | Anonymous nickname generation |
| `validation.js` | Response validation & sanitization |

### Frontend

| File | Purpose |
|------|---------|
| `index.js` | Main page with search & results |
| `ResultCard.js` | Displays 6-part explanation |
| `store.js` | Global state (user, current topic) |
| `auth.js` | Google sign-in integration |
| `utils.js` | TTS, clipboard, avatar generation |

### Mobile

| File | Purpose |
|------|---------|
| `HomeScreen.js` | Search + popular topics |
| `ResultScreen.js` | Full explanation view |
| `database.js` | SQLite for offline cache |
| `tts.js` | Device text-to-speech |

## 📦 Dependencies Summary

### Backend
- **express** - Web framework
- **pg** - PostgreSQL client
- **ioredis** - Redis client
- **bullmq** - Job queue
- **firebase-admin** - Authentication
- **groq-sdk** - Groq AI
- **openai** - OpenAI API
- **winston** - Logging
- **joi** - Validation

### Frontend
- **next** - React framework
- **react** - UI library
- **firebase** - Auth SDK
- **axios** - HTTP client
- **framer-motion** - Animations
- **zustand** - State management
- **tailwindcss** - Styling

### Mobile
- **expo** - React Native framework
- **react-navigation** - Navigation
- **expo-sqlite** - Local database
- **expo-speech** - Text-to-speech
- **axios** - HTTP client

## 🎯 Data Flow

### User Authentication
```
Firebase (Client) → Backend (verify token) → Generate nickname → Store in DB → Return session
```

### Explanation Request
```
Client → Backend → Redis (check) → Postgres (check) → AI Model → Validate → Save → Return
```

### Verification Request
```
Client → Backend → Queue job → Worker picks up → Call higher model → Update DB → Mark complete
```

## 🔐 Environment Variables

### Backend Required
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `GROQ_API_KEY` - Primary AI model
- `FIREBASE_ADMIN_JSON` - Auth credentials
- `JWT_SECRET` - Session token signing

### Frontend Required
- `NEXT_PUBLIC_API_URL` - Backend URL
- `NEXT_PUBLIC_FIREBASE_*` - Firebase config

### Mobile Required
- Set in `app.json` under `extra.apiUrl`

## 📈 Scalability Points

1. **Horizontal**: Multiple backend instances behind load balancer
2. **Caching**: Redis cluster for distributed cache
3. **Database**: Read replicas for high traffic
4. **Workers**: Scale worker count independently
5. **CDN**: Cloudflare for static + precomputed topics

## 🎨 Customization Points

1. **Prompts**: Edit `backend/src/utils/prompts.js`
2. **Models**: Add providers in `backend/src/services/providers/`
3. **UI Theme**: Edit `frontend/tailwind.config.js`
4. **Nickname Words**: Modify `backend/src/utils/nickname.js`
5. **Response Schema**: Update `backend/src/utils/validation.js`

---

**Total Files Created: 60+**
**Total Lines of Code: ~6,000+**
**Deployment Ready: ✅**
