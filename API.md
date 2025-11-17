# QuickLearn AI - API Reference

## Base URL

```
Production: https://quicklearn-backend.onrender.com/api
Development: http://localhost:3000/api
```

## Authentication

Most endpoints don't require authentication. User identification is optional.

Protected endpoints (admin) require header:
```
X-Admin-Token: your_admin_token
```

---

## Endpoints

### Authentication

#### POST `/auth/login`

Google sign-in and create/retrieve user session.

**Request:**
```json
{
  "idToken": "firebase_id_token_here"
}
```

**Response:**
```json
{
  "sessionToken": "jwt_token",
  "nickname": "Turbo-Papaya-042",
  "avatarSeed": "12345",
  "creditsVerified": 0
}
```

---

#### POST `/auth/regenerate-nickname`

Generate new nickname for user.

**Request:**
```json
{
  "userId": "firebase_user_id"
}
```

**Response:**
```json
{
  "nickname": "Cosmic-Penguin-789"
}
```

---

#### POST `/auth/regenerate-avatar`

Generate new avatar seed.

**Request:**
```json
{
  "userId": "firebase_user_id"
}
```

**Response:**
```json
{
  "avatarSeed": "67890"
}
```

---

### Explanations

#### POST `/explain`

Get explanation for a topic. Returns cached if available, generates if not.

**Request:**
```json
{
  "topic": "photosynthesis",
  "user_id": "optional_user_id",
  "force_verify": false
}
```

**Response:**
```json
{
  "topic": "photosynthesis",
  "source": "cache|groq/compound-mini|database",
  "content": {
    "one_line": "Process by which plants convert sunlight into energy",
    "explanation": "Photosynthesis is the biochemical process...",
    "analogy": "Think of it like a solar panel for plants...",
    "example": "When a tree's leaves are exposed to sunlight...",
    "formula": "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
    "revision_note": "Plants make food from sunlight, water, and CO₂",
    "verified": false
  },
  "cached": true,
  "verification_enqueued": false,
  "responseTime": 45
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid topic
- `503` - All models unavailable

---

### Verification

#### POST `/verify`

Request verification/enhancement of existing explanation using higher-tier models. Processed in background.

**Request:**
```json
{
  "topic": "quantum entanglement",
  "user_id": "optional_user_id",
  "priority": "normal|high"
}
```

**Response:**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "message": "Verification request accepted"
}
```

---

#### GET `/verify/:jobId`

Check status of verification job.

**Response:**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "topic": "quantum entanglement",
  "status": "queued|processing|completed|failed",
  "createdAt": "2024-01-15T10:30:00Z",
  "processedAt": "2024-01-15T10:31:23Z",
  "log": {
    "success": true,
    "model": "openai/gpt-oss-120b"
  }
}
```

---

### Topics

#### GET `/topics/popular?limit=50`

Get most frequently requested topics.

**Query Parameters:**
- `limit` (optional) - Number of topics to return (default: 50, max: 100)

**Response:**
```json
{
  "topics": [
    {
      "topic": "photosynthesis",
      "uses": 1523,
      "verified": true,
      "updated_at": "2024-01-15T10:30:00Z"
    },
    ...
  ],
  "count": 50
}
```

---

#### GET `/topics/recent?limit=20`

Get recently used topics.

**Response:**
```json
{
  "topics": [
    {
      "topic": "blockchain",
      "uses": 45,
      "verified": false,
      "last_used": "2024-01-15T11:45:00Z"
    },
    ...
  ],
  "count": 20
}
```

---

#### GET `/topics/search?q=dna`

Search for topics by partial match.

**Query Parameters:**
- `q` - Search query (min 2 characters)

**Response:**
```json
{
  "topics": [
    {
      "topic": "dna replication",
      "uses": 234,
      "verified": true
    },
    {
      "topic": "dna structure",
      "uses": 189,
      "verified": true
    }
  ],
  "count": 2
}
```

---

### Feedback

#### POST `/feedback`

Submit user feedback on explanation quality.

**Request:**
```json
{
  "user_id": "optional_user_id",
  "topic": "photosynthesis",
  "rating": 5,
  "note": "Very clear explanation!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your feedback!"
}
```

---

### Admin (Protected)

All admin endpoints require `X-Admin-Token` header.

#### GET `/admin/stats`

Get system statistics and metrics.

**Response:**
```json
{
  "database": {
    "users": 1523,
    "explanations": 3847,
    "verified": 892
  },
  "jobs": [
    { "status": "queued", "count": 12 },
    { "status": "processing", "count": 3 },
    { "status": "completed", "count": 456 },
    { "status": "failed", "count": 8 }
  ],
  "cache": {
    "keys": 2341,
    "redisInfo": ["total_commands_processed:123456"]
  },
  "models": {
    "groq/compound-mini": 45678,
    "groq/compound": 892,
    "openai/gpt-oss-120b": 234
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

---

#### GET `/admin/top-topics?limit=100`

Get top topics by usage count.

**Response:**
```json
{
  "topics": [
    {
      "topic": "photosynthesis",
      "uses": 1523,
      "verified": true,
      "source_model": "groq/compound",
      "created_at": "2024-01-01T00:00:00Z",
      "last_used": "2024-01-15T11:59:00Z"
    },
    ...
  ],
  "count": 100
}
```

---

#### GET `/admin/recent-jobs?limit=50`

Get recent background jobs.

**Response:**
```json
{
  "jobs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "topic": "quantum computing",
      "job_type": "verify",
      "status": "completed",
      "created_at": "2024-01-15T10:00:00Z",
      "processed_at": "2024-01-15T10:02:15Z"
    },
    ...
  ],
  "count": 50
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message here",
  "details": "Optional additional details"
}
```

**Common Status Codes:**
- `400` - Bad Request (invalid input)
- `403` - Forbidden (invalid admin token)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable (all models exhausted)

---

## Rate Limiting

- **Global**: 10,000 requests per 15 minutes per IP
- **Per User**: 200 requests per day (soft limit, invisible)
- **Admin**: No rate limit

Rate limit headers included in response:
```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9876
X-RateLimit-Reset: 1705320000
```

---

## Examples

### cURL

```bash
# Get explanation
curl -X POST https://quicklearn-backend.onrender.com/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"gravity"}'

# Get popular topics
curl https://quicklearn-backend.onrender.com/api/topics/popular?limit=10

# Admin stats
curl https://quicklearn-backend.onrender.com/api/admin/stats \
  -H "X-Admin-Token: your_token"
```

### JavaScript

```javascript
// Get explanation
const response = await fetch('https://quicklearn-backend.onrender.com/api/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'gravity' })
});
const data = await response.json();
console.log(data.content);
```

### Python

```python
import requests

# Get explanation
response = requests.post(
    'https://quicklearn-backend.onrender.com/api/explain',
    json={'topic': 'gravity'}
)
data = response.json()
print(data['content']['one_line'])
```

---

## Webhooks (Future)

Not currently implemented. Planned for notification of job completion.

---

## Versioning

Current version: **v1** (implicit, no version in URL)

Breaking changes will introduce v2 with `/api/v2/` prefix.

---

## Support

- GitHub Issues: https://github.com/yourusername/quicklearn-ai/issues
- Email: api-support@quicklearn.ai
