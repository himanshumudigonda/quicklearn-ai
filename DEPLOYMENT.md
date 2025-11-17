# QuickLearn AI - Deployment Guide

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (free tier available)
- Firebase project
- API keys: Groq, OpenAI

### Step-by-Step Deployment

#### 1. Prepare Repository

```bash
# Clone/push your code to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/quicklearn-ai.git
git push -u origin main
```

#### 2. Set Up Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically

#### 3. Configure Environment Variables

Add these secrets in Render dashboard for **quicklearn-backend**:

```
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-...
FIREBASE_ADMIN_JSON={"type":"service_account",...}
```

The following are auto-generated:
- `JWT_SECRET`
- `ADMIN_TOKEN`

#### 4. Deploy

Click **"Apply"** and wait for:
- Database creation
- Redis instance
- Backend service
- Worker service

Expected time: 5-10 minutes

#### 5. Verify Deployment

```bash
# Test health endpoint
curl https://quicklearn-backend.onrender.com/health

# Response should be:
# {"status":"ok","timestamp":"...","uptime":123}
```

#### 6. Deploy Frontend to Vercel

```bash
cd frontend
npm install -g vercel
vercel

# Add environment variables when prompted:
# NEXT_PUBLIC_API_URL=https://quicklearn-backend.onrender.com
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## 🔧 Manual Deployment (Alternative)

### Backend on Any VPS

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/quicklearn-ai.git
cd quicklearn-ai/backend

# Install dependencies
npm install --production

# Set up PostgreSQL
sudo -u postgres createdb quicklearn
sudo -u postgres createuser quicklearn

# Set up Redis
sudo apt install redis-server
sudo systemctl start redis

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://quicklearn:password@localhost:5432/quicklearn
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_TOKEN=$(openssl rand -base64 32)
GROQ_API_KEY=your_key
OPENAI_API_KEY=your_key
FIREBASE_ADMIN_JSON='{"type":"service_account",...}'
EOF

# Install PM2
npm install -g pm2

# Start services
pm2 start src/server.js --name quicklearn-api
pm2 start src/worker.js --name quicklearn-worker
pm2 save
pm2 startup

# Set up Nginx reverse proxy
sudo nano /etc/nginx/sites-available/quicklearn

# Add:
server {
    listen 80;
    server_name api.quicklearn.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/quicklearn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Set up SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.quicklearn.ai
```

---

## 📱 Mobile App Deployment

### Build Android APK

```bash
cd mobile

# Update app.json with production API URL
nano app.json
# Change "apiUrl" to "https://quicklearn-backend.onrender.com"

# Build APK
npx expo build:android

# Or use EAS Build
npm install -g eas-cli
eas login
eas build --platform android
```

### Distribute

- **Internal Testing**: Share APK directly
- **Google Play**: Follow [Expo submission guide](https://docs.expo.dev/submit/android/)
- **TestFlight (iOS)**: Follow [Expo iOS guide](https://docs.expo.dev/submit/ios/)

---

## 🗄️ Database Setup

### Initial Data Seeding

```bash
# Run seed script to precompute popular topics
cd backend
node scripts/seedTopics.js
```

### Backup Strategy

```bash
# PostgreSQL backup
pg_dump -U quicklearn quicklearn > backup_$(date +%Y%m%d).sql

# Restore
psql -U quicklearn quicklearn < backup_20240101.sql

# Automated daily backups (cron)
0 2 * * * pg_dump -U quicklearn quicklearn > /backups/quicklearn_$(date +\%Y\%m\%d).sql
```

---

## 🔍 Monitoring Setup

### Health Checks

Add to Render dashboard or use external monitoring:

```bash
# Uptime monitoring
curl -fsS -m 10 --retry 5 https://quicklearn-backend.onrender.com/health || exit 1
```

### Log Aggregation

```bash
# View logs on Render
render logs -s quicklearn-backend -f

# Or use logging service (Papertrail, Logtail)
# Add drain URL in Render dashboard
```

### Alerts

Set up alerts for:
- Service downtime
- High error rate (>5%)
- Database connection failures
- Redis unavailable
- API latency >2s

---

## 💾 Redis Configuration

### Production Settings

```bash
# Connect to Render Redis
redis-cli -u $REDIS_URL

# Set eviction policy
CONFIG SET maxmemory-policy allkeys-lru

# Persistence (if using dedicated Redis)
CONFIG SET save "900 1 300 10 60 10000"
```

---

## 🔐 Security Hardening

### Backend

```bash
# Update dependencies
npm audit fix

# Add Helmet.js (already included)
# Add rate limiting (already included)

# Environment secrets
# Never commit .env
# Use Render secret variables
```

### Database

```sql
-- Create read-only user for analytics
CREATE USER analytics WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics;

-- Revoke unnecessary permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
```

---

## 📊 Performance Optimization

### Database Indexes

```sql
-- Already created in migration
CREATE INDEX idx_explanations_topic ON explanations(topic);
CREATE INDEX idx_explanations_verified ON explanations(verified);
CREATE INDEX idx_jobs_status ON jobs(status);
```

### Redis Optimization

```bash
# Monitor memory usage
redis-cli INFO memory

# Check hit rate
redis-cli INFO stats | grep keyspace
```

### CDN Setup (Optional)

1. Sign up for Cloudflare
2. Add your domain
3. Enable caching for `/api/topics/*`
4. Set cache TTL: 1 hour

---

## 🧪 Testing in Production

```bash
# API test
curl -X POST https://quicklearn-backend.onrender.com/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"test"}'

# Load test with Apache Bench
ab -n 1000 -c 10 https://quicklearn-backend.onrender.com/health

# Or use k6
k6 run loadtest.js
```

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

Add `RENDER_DEPLOY_HOOK` to GitHub Secrets.

---

## 🆘 Troubleshooting

### Service Won't Start

```bash
# Check logs
render logs -s quicklearn-backend -f

# Common issues:
# - Missing env vars
# - Database connection failed
# - Redis unavailable
```

### High Memory Usage

```bash
# Check Node.js memory
pm2 monit

# Increase if needed (Render)
# Upgrade to Standard plan (1 GB → 4 GB)
```

### Slow Responses

```bash
# Check Redis hit rate
redis-cli INFO stats

# Check database slow queries
SELECT query, calls, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

---

## 📞 Support Contacts

- **Render Support**: support@render.com
- **Urgent Issues**: Your DevOps team
- **Documentation**: https://render.com/docs

---

**Deployment Complete! 🎉**

Your QuickLearn AI app should now be live at:
- Backend: `https://quicklearn-backend.onrender.com`
- Frontend: `https://quicklearn-ai.vercel.app`
- Mobile: TestFlight or APK download link
