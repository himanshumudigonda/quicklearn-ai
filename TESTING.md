# Testing Guide for Model Integration

## Prerequisites

✅ Groq API Key: Add your key to `backend/.env`
✅ All 15+ models configured in provider files
✅ Backend server running on port 3000

## Quick Test Commands

### 1. Test Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T...",
  "services": {
    "redis": "connected",
    "database": "connected"
  }
}
```

### 2. Test Primary Model (compound-mini)
```bash
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "photosynthesis"
  }'
```

Expected response:
```json
{
  "success": true,
  "topic": "photosynthesis",
  "source": "groq/compound-mini",
  "content": {
    "one_line": "Plants convert light into energy...",
    "explanation": "Photosynthesis is the process...",
    "analogy": "Think of it like solar panels...",
    "example": "A leaf in sunlight...",
    "formula": "6CO2 + 6H2O + light → C6H12O6 + 6O2",
    "revision_note": "Remember: Chlorophyll captures light..."
  },
  "cached": false,
  "verified": false,
  "tokensUsed": 245
}
```

### 3. Test Specific Model
```bash
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "quantum mechanics",
    "preferredModel": "qwen/qwen3-32b-instruct"
  }'
```

### 4. Test Verification Endpoint
```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "photosynthesis",
    "explanationId": "abc123"
  }'
```

### 5. Test Fallback Chain

To test the fallback mechanism, you can simulate a model failure:

```bash
# This will force the system to try multiple models
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "test_fallback_mechanism_12345"
  }'
```

## Integration Tests

### Test 1: Verify All Groq Models Work

```javascript
// backend/tests/groq-models.test.js
const { callGroqModel } = require('../src/services/providers/groq');

const models = [
  'compound-mini',
  'compound',
  'qwen3-32b',
  'llama-4-scout-17b',
  'llama-4-maverick-17b-128e',
  'llama-guard-4-12b',
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'kimi-k2-instruct',
];

async function testAllModels() {
  for (const model of models) {
    console.log(`Testing ${model}...`);
    const result = await callGroqModel('What is gravity?', model);
    console.log(`${model}: ${result.success ? '✅' : '❌'}`);
    if (!result.success) {
      console.error(`Error: ${result.error}`);
    }
  }
}

testAllModels();
```

### Test 2: Verify Response Format

```javascript
// backend/tests/response-format.test.js
const { validateExplanationResponse } = require('../src/utils/validation');

const testResponse = {
  one_line: "Test summary",
  explanation: "Test explanation",
  analogy: "Test analogy",
  example: "Test example",
  formula: "E = mc²",
  revision_note: "Test note"
};

const validation = validateExplanationResponse(testResponse);
console.log('Validation:', validation.valid ? '✅ PASS' : '❌ FAIL');
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

### Test 3: Load Test Model Fallback

```bash
# Run multiple concurrent requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/explain \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d "{\"topic\": \"topic_$i\"}" &
done
wait
```

## Monitoring Model Performance

### Check Redis Cache
```bash
redis-cli
> KEYS hot:*
> GET hot:photosynthesis
> KEYS model:counter:*
> GET model:counter:groq/compound-mini
```

### Check Database Stats
```sql
-- Connect to PostgreSQL
psql postgresql://user:password@localhost:5432/quicklearn

-- Check explanation sources
SELECT source_model, COUNT(*) as count
FROM explanations
GROUP BY source_model
ORDER BY count DESC;

-- Check verification status
SELECT verified, COUNT(*) as count
FROM explanations
GROUP BY verified;

-- Check popular topics
SELECT topic, uses, verified
FROM explanations
ORDER BY uses DESC
LIMIT 10;
```

### Check Model Counters
```bash
curl http://localhost:3000/api/admin/metrics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Expected response:
```json
{
  "models": {
    "groq/compound-mini": {
      "requests": 1234,
      "tokens": 567890
    },
    "groq/compound": {
      "requests": 456,
      "tokens": 234567
    },
    ...
  },
  "cache": {
    "hitRate": 0.89,
    "totalHits": 8900,
    "totalMisses": 1100
  }
}
```

## Debugging

### Enable Verbose Logging

Update `backend/src/utils/logger.js`:
```javascript
level: process.env.LOG_LEVEL || 'debug'
```

Then restart server:
```bash
cd backend
npm run dev
```

### Check Logs
```bash
# Real-time logs
tail -f backend/logs/combined.log

# Error logs only
tail -f backend/logs/error.log

# Filter by model
grep "groq/compound-mini" backend/logs/combined.log
```

### Test Individual Provider

```javascript
// backend/scripts/test-provider.js
require('dotenv').config();
const { callGroqModel } = require('./src/services/providers/groq');

async function test() {
  const result = await callGroqModel('Explain gravity', 'compound-mini');
  console.log(JSON.stringify(result, null, 2));
}

test();
```

Run:
```bash
cd backend
node scripts/test-provider.js
```

## Common Issues & Solutions

### Issue: "Empty response from model"
**Solution**: Check if model name is correct in provider file

### Issue: "Invalid JSON response"
**Solution**: Ensure response_format is set to json_object

### Issue: "Rate limit exceeded"
**Solution**: Wait 1 hour or increase rate limits in Redis

### Issue: "Model not found"
**Solution**: Verify model name matches Groq API documentation

### Issue: "API key invalid"
**Solution**: Check .env file has correct GROQ_API_KEY

## Performance Benchmarks

Expected response times:
- compound-mini: 500-1000ms
- compound: 800-1500ms
- qwen3-32b: 1000-2000ms
- llama-4-scout: 1500-2500ms
- llama-3.3-70b: 2000-4000ms
- gpt-oss-120b: 3000-6000ms

Cache hits: < 50ms

## Success Criteria

✅ All Groq models respond successfully
✅ Fallback chain works when models fail
✅ Response format validation passes
✅ Cache hit rate > 80%
✅ Average response time < 2 seconds
✅ Model counters tracking correctly
✅ Verification improves explanation quality

## Next Steps

After successful testing:
1. Set up Firebase Authentication
2. Configure production database (Render Postgres)
3. Deploy to Render
4. Set up monitoring (Sentry, DataDog)
5. Configure CDN (Cloudflare)
6. Enable rate limiting
7. Set up backup strategies
