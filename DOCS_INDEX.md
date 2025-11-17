# QuickLearn AI - Documentation Index

Welcome to QuickLearn AI! This index will guide you to the right documentation.

## 🚀 Getting Started

**New to the project?** Start here:

1. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Overview of what's been built
2. **[QUICKSTART.md](QUICKSTART.md)** - Get running locally in 10 minutes
3. **[README.md](README.md)** - Full project documentation

## 📖 Documentation Map

### For Developers

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [QUICKSTART.md](QUICKSTART.md) | Fast local setup | Setting up dev environment |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Code organization | Understanding the codebase |
| [API.md](API.md) | API reference | Integrating or using the API |
| [README.md](README.md) | Complete guide | Deep dive into architecture |

### For DevOps/Deployment

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment | Deploying to cloud |
| [render.yaml](render.yaml) | Render config | One-click deploy setup |

### For Project Managers

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What's built | Project overview |
| [README.md](README.md) | Features & goals | Understanding scope |

## 🗂️ Quick Navigation

### I want to...

#### ...run the app locally
→ Read [QUICKSTART.md](QUICKSTART.md) (10 minutes)

#### ...deploy to production
→ Read [DEPLOYMENT.md](DEPLOYMENT.md) (20 minutes)

#### ...understand the code structure
→ Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

#### ...use the API
→ Read [API.md](API.md)

#### ...customize the UI
→ Edit files in `frontend/components/` and `frontend/tailwind.config.js`

#### ...add a new AI model
→ Create provider in `backend/src/services/providers/` and add to `modelRouter.js`

#### ...change the prompts
→ Edit `backend/src/utils/prompts.js`

#### ...modify the database schema
→ Edit `backend/src/db/index.js` (tables auto-create)

#### ...add more nickname words
→ Edit `backend/src/utils/nickname.js`

#### ...understand cost optimization
→ Read [README.md](README.md) → "Cost Optimization" section

## 📋 Component Documentation

### Backend Components

| Component | Location | Docs Section |
|-----------|----------|--------------|
| API Routes | `backend/src/routes/` | [API.md](API.md) |
| Model Router | `backend/src/services/modelRouter.js` | [README.md](README.md) → Models |
| Database | `backend/src/db/` | [README.md](README.md) → Data Model |
| Cache | `backend/src/cache/` | [README.md](README.md) → Caching |
| Auth | `backend/src/routes/auth.js` | [README.md](README.md) → Authentication |

### Frontend Components

| Component | Location | Description |
|-----------|----------|-------------|
| Search Bar | `frontend/components/SearchBar.js` | Main search input |
| Result Card | `frontend/components/ResultCard.js` | Explanation display |
| Profile | `frontend/components/ProfileButton.js` | User menu |
| Admin | `frontend/pages/admin.js` | Dashboard |

### Mobile Components

| Component | Location | Description |
|-----------|----------|-------------|
| Home | `mobile/screens/HomeScreen.js` | Search screen |
| Result | `mobile/screens/ResultScreen.js` | Explanation view |
| Profile | `mobile/screens/ProfileScreen.js` | User profile |

## 🎯 Common Tasks

### Setup & Installation

```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Frontend setup
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your config
npm run dev

# Mobile setup
cd mobile
npm install
npm start
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Get explanation
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"photosynthesis"}'

# Popular topics
curl http://localhost:3000/api/topics/popular?limit=10
```

### Deployment

```bash
# Deploy to Render (with render.yaml)
git push origin main
# Then connect repo in Render dashboard

# Or manual deployment
# See DEPLOYMENT.md for detailed steps
```

## 🔧 Configuration Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `backend/.env` | Backend env vars | Setup, adding API keys |
| `frontend/.env.local` | Frontend env vars | Setup, changing API URL |
| `mobile/app.json` | Expo configuration | Mobile setup, branding |
| `tailwind.config.js` | UI theme | Customizing colors/styles |
| `render.yaml` | Deployment config | Changing deploy settings |

## 📚 Learning Path

### Beginner (First Day)
1. Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Test the app locally
4. Explore [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

### Intermediate (Week 1)
1. Read full [README.md](README.md)
2. Study [API.md](API.md)
3. Modify prompts and test changes
4. Deploy to staging (Render)

### Advanced (Week 2)
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Set up monitoring & logging
3. Add a custom AI model provider
4. Optimize caching strategy

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution | Reference |
|-------|----------|-----------|
| "Cannot connect to database" | Check PostgreSQL running | [QUICKSTART.md](QUICKSTART.md) → Common Issues |
| "Redis connection failed" | Start Redis server | [QUICKSTART.md](QUICKSTART.md) → Common Issues |
| "Model API error" | Check API key in .env | [README.md](README.md) → Setup |
| "Firebase auth error" | Verify Firebase config | [DEPLOYMENT.md](DEPLOYMENT.md) → Firebase Setup |

## 📞 Getting Help

1. **Check Docs First**: Use this index to find the right guide
2. **Search Issues**: Look for similar problems in GitHub Issues
3. **Ask Questions**: Open a new issue with details
4. **Community**: Join Discord/Slack (if available)

## 🎯 Quick Reference Cards

### Environment Variables Cheat Sheet

**Backend Required:**
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GROQ_API_KEY=gsk_...
FIREBASE_ADMIN_JSON={"type":"service_account",...}
JWT_SECRET=random-secret-key
```

**Frontend Required:**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### Port Reference

| Service | Default Port | Configurable |
|---------|--------------|--------------|
| Backend API | 3000 | Yes (PORT env) |
| Frontend | 3001 | Yes (next.js auto) |
| PostgreSQL | 5432 | Database URL |
| Redis | 6379 | Redis URL |
| Mobile (Expo) | 19000 | Auto |

### File Size Reference

| Component | Files | LOC (approx) |
|-----------|-------|--------------|
| Backend | 25 | ~3,000 |
| Frontend | 15 | ~2,000 |
| Mobile | 12 | ~1,500 |
| Docs | 8 | ~2,000 (words) |
| **Total** | **60+** | **~6,500+** |

## 🎉 Success Checklist

After reading docs and setting up:

- [ ] Backend running locally (http://localhost:3000/health returns OK)
- [ ] Frontend running locally (can search topics)
- [ ] Mobile app running (Expo Dev Client or emulator)
- [ ] Database connected (can save explanations)
- [ ] Redis connected (cache working)
- [ ] Firebase auth working (can sign in with Google)
- [ ] Admin dashboard accessible (can view stats)
- [ ] Understand project structure
- [ ] Know where to find API docs
- [ ] Know how to deploy to production

## 📖 Document Change Log

| Date | Document | Changes |
|------|----------|---------|
| 2024-01-15 | All | Initial creation |
| - | - | (Track updates here) |

## 🔗 External Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Express Guide**: https://expressjs.com/en/guide/routing.html
- **Expo Docs**: https://docs.expo.dev/
- **PostgreSQL Manual**: https://www.postgresql.org/docs/
- **Redis Documentation**: https://redis.io/docs/
- **Groq API**: https://console.groq.com/docs/

## 📝 Contributing

Want to improve the docs?

1. Fork the repository
2. Edit the markdown files
3. Submit a pull request
4. Follow documentation standards:
   - Clear headings
   - Code examples
   - Links to related docs
   - Practical examples

---

## 🎓 Documentation Best Practices

This project follows these documentation principles:

1. **Layered Information**: Quick start → Deep dive
2. **Task-Oriented**: "How do I..." structure
3. **Examples First**: Show code before explaining
4. **Cross-Referenced**: Links between related docs
5. **Maintained**: Updated with code changes

---

**Last Updated**: 2024-01-15
**Docs Version**: 1.0.0
**Project Version**: 1.0.0

---

**Need help? Start with [QUICKSTART.md](QUICKSTART.md) or open an issue!** 🚀
