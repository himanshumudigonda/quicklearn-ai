# AI Models Configuration

## Overview

QuickLearn AI uses a sophisticated multi-model fallback strategy with 15+ AI models across multiple providers. This ensures high availability, optimal performance, and cost efficiency.

## Model Providers

### 1. Groq (Primary Provider)
API Key: Configure in `.env` file

### 2. OpenAI (Secondary Provider)
API Key required: Configure in `.env`

## Model Catalog

### Tier 1: Ultra-Fast (Primary Generation)

#### groq/compound-mini
- **Provider**: Groq
- **Model ID**: `groq/compound-mini`
- **Use Case**: Primary explanation generation (fastest)
- **Parameters**:
  - Temperature: 1.0
  - Max Tokens: 1024
  - Stream: false
- **Cost Tier**: 1 (lowest)
- **Features**: Optimized for speed, good quality

#### groq/compound
- **Provider**: Groq
- **Model ID**: `groq/compound`
- **Use Case**: Secondary generation with tools
- **Parameters**:
  - Temperature: 1.0
  - Max Tokens: 1024
  - Stream: false
  - Tools: web_search, code_interpreter, visit_website
- **Cost Tier**: 2
- **Features**: Enhanced with tool calling capabilities

### Tier 2: Medium Quality

#### qwen/qwen3-32b-instruct
- **Provider**: Groq
- **Model ID**: `qwen/qwen3-32b-instruct`
- **Use Case**: High-quality explanations for complex topics
- **Parameters**:
  - Temperature: 0.6
  - Max Tokens: 4096
  - Top P: 0.95
  - Stream: false
- **Cost Tier**: 3
- **Features**: Balanced speed and quality

#### meta-llama/llama-4-scout-17b
- **Provider**: Groq
- **Model ID**: `meta-llama/llama-4-scout-17b`
- **Use Case**: Educational content generation
- **Parameters**:
  - Temperature: 0.6
  - Max Tokens: 4096
  - Stream: false
- **Cost Tier**: 3
- **Features**: Specialized for educational content

#### meta-llama/llama-4-maverick-17b-128e
- **Provider**: Groq
- **Model ID**: `meta-llama/llama-4-maverick-17b-128e`
- **Use Case**: Extended context explanations
- **Parameters**:
  - Temperature: 0.6
  - Max Tokens: 4096
  - Stream: false
- **Cost Tier**: 3
- **Features**: 128 expert routing for specialized topics

### Tier 3: Specialized Models

#### meta-llama/llama-guard-4-12b
- **Provider**: Groq
- **Model ID**: `meta-llama/llama-guard-4-12b`
- **Use Case**: Safety and content moderation
- **Parameters**:
  - Temperature: 0.6
  - Max Tokens: 4096
  - Stream: false
- **Cost Tier**: 4
- **Features**: Content safety validation

#### llama-3.1-8b-instant
- **Provider**: Groq
- **Model ID**: `llama-3.1-8b-instant`
- **Use Case**: Fast fallback option
- **Parameters**:
  - Temperature: 0.6
  - Max Tokens: 4096
  - Stream: false
- **Cost Tier**: 3
- **Features**: Instant response time

### Tier 4: Large Versatile Models

#### llama-3.3-70b-versatile
- **Provider**: Groq
- **Model ID**: `llama-3.3-70b-versatile`
- **Use Case**: Complex topic explanations
- **Parameters**:
  - Temperature: 0.6
  - Max Tokens: 8192
  - Stream: false
- **Cost Tier**: 5
- **Features**: Large context window, versatile

#### moonshotai/kimi-k2-instruct
- **Provider**: Groq (via Moonshot AI)
- **Model ID**: `moonshotai/kimi-k2-instruct`
- **Use Case**: Advanced reasoning tasks
- **Parameters**:
  - Temperature: 0.6
  - Max Tokens: 4096
  - Stream: false
- **Cost Tier**: 5
- **Features**: Chinese and English support

### Tier 5: Premium OpenAI Models

#### openai/gpt-oss-20b
- **Provider**: OpenAI
- **Model ID**: `openai/gpt-oss-20b`
- **Use Case**: Verification and enhancement
- **Parameters**:
  - Temperature: 1.0
  - Max Tokens: 8192
  - Reasoning Effort: medium
  - Stream: false
- **Cost Tier**: 6
- **Features**: Open-source style reasoning

#### openai/gpt-oss-safeguard-20b
- **Provider**: OpenAI
- **Model ID**: `openai/gpt-oss-safeguard-20b`
- **Use Case**: Safe content generation
- **Parameters**:
  - Temperature: 1.0
  - Max Tokens: 8192
  - Reasoning Effort: medium
  - Stream: false
- **Cost Tier**: 6
- **Features**: Enhanced safety guardrails

#### openai/gpt-oss-120b
- **Provider**: OpenAI
- **Model ID**: `openai/gpt-oss-120b`
- **Use Case**: Premium verification
- **Parameters**:
  - Temperature: 1.0
  - Max Tokens: 8192
  - Reasoning Effort: high
  - Stream: false
- **Cost Tier**: 8
- **Features**: Highest quality reasoning

### Tier 6: Fallback Models

#### openai/gpt-4o-mini
- **Provider**: OpenAI
- **Model ID**: `gpt-4o-mini`
- **Use Case**: General fallback
- **Parameters**:
  - Temperature: 0.7
  - Max Tokens: 4096
  - Stream: false
- **Cost Tier**: 7
- **Features**: Reliable OpenAI model

#### openai/gpt-4o
- **Provider**: OpenAI
- **Model ID**: `gpt-4o`
- **Use Case**: Ultimate fallback
- **Parameters**:
  - Temperature: 0.7
  - Max Tokens: 4096
  - Stream: false
- **Cost Tier**: 10 (highest)
- **Features**: Best OpenAI model available

## Fallback Strategy

The system tries models in order of cost and speed:

1. **Primary Tier** (Groq Fast)
   - compound-mini → compound

2. **Secondary Tier** (Groq Medium)
   - qwen3-32b → llama-4-scout → llama-4-maverick

3. **Tertiary Tier** (Groq Specialized)
   - llama-guard-4 → llama-3.1-8b-instant

4. **Quaternary Tier** (Groq Large)
   - llama-3.3-70b → kimi-k2

5. **Premium Tier** (OpenAI)
   - gpt-oss-20b → gpt-oss-safeguard-20b → gpt-oss-120b

6. **Ultimate Fallback** (OpenAI)
   - gpt-4o-mini → gpt-4o

## Model Selection Logic

### For Explanation Generation
- Start with fastest model (compound-mini)
- Fallback to next tier if:
  - API error
  - Rate limit exceeded
  - Invalid response format
  - Model temporarily unavailable

### For Verification
- Use only models with cost >= 5
- Prefer models marked as "powerful" or "premium"
- Skip "fast" tier models for verification

## Cost Optimization

- **Caching**: 90% of requests served from cache
- **Tier Prioritization**: Fast models first
- **Quota Tracking**: Monitor per-model usage
- **Failed Model Tracking**: Skip failed models for 1 hour

## Response Format

All models must return JSON with structure:
```json
{
  "one_line": "Quick summary",
  "explanation": "Detailed explanation",
  "analogy": "Relatable analogy",
  "example": "Practical example",
  "formula": "Mathematical formula (if applicable)",
  "revision_note": "Key points to remember"
}
```

## Monitoring

Track these metrics per model:
- Request count
- Success rate
- Average response time
- Token usage
- Error types

## Configuration Files

- **Provider Implementation**: `backend/src/services/providers/groq.js`
- **OpenAI Implementation**: `backend/src/services/providers/openai.js`
- **Fallback Logic**: `backend/src/services/modelRouter.js`
- **Environment Config**: `backend/.env`

## Adding New Models

To add a new model:

1. Add configuration to appropriate provider file:
```javascript
'new-model': {
  name: 'provider/model-name',
  temperature: 0.6,
  max_tokens: 4096,
  stream: false,
}
```

2. Add to MODEL_CHAIN in `modelRouter.js`:
```javascript
{ 
  name: 'provider/model-name', 
  provider: 'groq', 
  model: 'new-model', 
  cost: 3, 
  tier: 'medium' 
}
```

3. Test the integration:
```bash
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"photosynthesis","preferredModel":"provider/model-name"}'
```

## Troubleshooting

### Model Not Responding
- Check API key configuration
- Verify model name matches provider's API
- Review rate limits in Redis
- Check failedModels set in modelRouter

### Invalid Response Format
- Verify JSON parsing logic
- Check validation schema
- Review model's system prompt
- Ensure response_format is set correctly

### Rate Limiting
- Implement backoff strategy
- Increase Redis TTL for rate limits
- Consider model quotas
- Monitor per-user limits

## API Key Security

⚠️ **Never commit `.env` file to version control**

Current configuration:
- `.env.example` - Template with placeholders
- `.env` - Actual keys (git-ignored)
- Render/Vercel - Environment variables in dashboard

## Future Enhancements

- [ ] Dynamic model selection based on topic complexity
- [ ] A/B testing different models
- [ ] Real-time cost tracking dashboard
- [ ] Automatic model quality scoring
- [ ] User feedback integration for model ranking
- [ ] Streaming support for longer explanations
- [ ] Multi-model ensemble responses
