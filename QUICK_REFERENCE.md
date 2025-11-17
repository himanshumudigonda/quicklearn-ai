# Quick Reference: API Keys & Models

## 🔑 API Keys

### Groq API (Primary Provider)
```
Status: ⚠️ CONFIGURE REQUIRED
Key: gsk_YOUR_GROQ_API_KEY_HERE
Location: backend/.env
Models: 11 models available
```

### OpenAI API (Secondary Provider)
```
Status: ⚠️ NOT CONFIGURED
Key: sk-... (add your key)
Location: backend/.env
Models: 4 models available
```

## 🤖 Available Models (15 Total)

### ⚡ Fastest (Use First)
```
1. groq/compound-mini          [500-1000ms]  Cost: 1
2. groq/compound               [800-1500ms]  Cost: 2
3. llama-3.1-8b-instant        [600-1200ms]  Cost: 3
```

### 🎯 Medium Quality
```
4. qwen/qwen3-32b-instruct     [1000-2000ms] Cost: 3
5. llama-4-scout-17b           [1500-2500ms] Cost: 3
6. llama-4-maverick-17b-128e   [1500-2500ms] Cost: 3
```

### 🛡️ Specialized
```
7. llama-guard-4-12b           [1500-2500ms] Cost: 4
8. llama-prompt-guard-2-22m    [1500-2500ms] Cost: 4
9. llama-prompt-guard-2-86m    [1500-2500ms] Cost: 4
```

### 💪 Powerful
```
10. llama-3.3-70b-versatile    [2000-4000ms] Cost: 5
11. kimi-k2-instruct           [2000-4000ms] Cost: 5
```

### 🏆 Premium (Verification Only)
```
12. gpt-oss-20b                [3000-5000ms] Cost: 6
13. gpt-oss-safeguard-20b      [3000-5000ms] Cost: 6
14. gpt-oss-120b               [3000-6000ms] Cost: 8
15. gpt-4o-mini                [2000-4000ms] Cost: 7
16. gpt-4o                     [3000-6000ms] Cost: 10
```

## 📊 Model Selection Strategy

### For Speed (90% of requests)
```
Primary: compound-mini
Backup:  compound → llama-3.1-8b-instant
```

### For Quality
```
Primary: qwen3-32b
Backup:  llama-4-scout → llama-4-maverick
```

### For Verification
```
Primary: llama-3.3-70b
Backup:  gpt-oss-20b → gpt-oss-120b
```

## 🚀 Quick Start Commands

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test API
```bash
curl http://localhost:3000/health
```

### 4. Test Model
```bash
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic": "gravity"}'
```

## 🔍 Check Configuration

### Verify API Key
```bash
cat backend/.env | grep GROQ_API_KEY
```

### Check Models in Code
```bash
grep -r "compound-mini" backend/src/services/
```

### Test Individual Model
```bash
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic": "test", "preferredModel": "qwen/qwen3-32b-instruct"}'
```

## 📈 Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Cache Hit Rate | 90% | TBD |
| Avg Response Time | <500ms | TBD |
| Model Success Rate | 99% | TBD |
| Primary Model Usage | 95% | TBD |

## 🔗 Documentation Links

- [MODELS.md](MODELS.md) - Full model catalog
- [TESTING.md](TESTING.md) - Testing procedures
- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Integration summary
- [API.md](API.md) - API reference

## 💡 Pro Tips

1. **Always try compound-mini first** - It's the fastest
2. **Enable caching** - 90% cache hit rate = 90% cost savings
3. **Monitor model counters** - Track which models are used most
4. **Use verification sparingly** - Only for popular topics
5. **Check logs regularly** - Identify failing models early

## ⚠️ Troubleshooting

### API Key Not Working
```bash
# Check if key is loaded
echo $GROQ_API_KEY

# Restart server to reload .env
npm run dev
```

### Model Not Found
```bash
# List available models
grep "name:" backend/src/services/providers/groq.js
```

### Slow Responses
```bash
# Check cache hit rate
redis-cli
> GET model:counter:groq/compound-mini
```

## 📞 Need Help?

1. Check [TESTING.md](TESTING.md) for debugging steps
2. Review logs: `tail -f backend/logs/combined.log`
3. Test with curl commands above
4. Verify .env file has correct API key

---

**Status**: ✅ Ready to use
**Last Updated**: 2025-01-09
**Models Configured**: 15
**API Keys Active**: 1/2 (Groq ✅, OpenAI ⚠️)
