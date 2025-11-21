const logger = require('../utils/logger');
const { incrementModelCounter } = require('../cache');
const { callGroqModel } = require('./providers/groq');
const { callOpenAIModel } = require('./providers/openai');
const { validateExplanationResponse } = require('../utils/validation');

// Model fallback chain configuration
// Priority order: fastest first, most powerful last
const MODEL_CHAIN = [
  // Tier 1: Ultra-fast lightweight models
  { name: 'groq/compound-mini', provider: 'groq', model: 'compound-mini', cost: 1, tier: 'fast' },

  // Tier 2: Fast with tools support
  { name: 'groq/compound', provider: 'groq', model: 'compound', cost: 2, tier: 'fast' },

  // Tier 3: Medium-speed, good quality
  { name: 'qwen/qwen3-32b-instruct', provider: 'groq', model: 'qwen3-32b', cost: 3, tier: 'medium' },
  { name: 'meta-llama/llama-4-scout-17b', provider: 'groq', model: 'llama-4-scout-17b', cost: 3, tier: 'medium' },
  { name: 'meta-llama/llama-4-maverick-17b-128e', provider: 'groq', model: 'llama-4-maverick-17b-128e', cost: 3, tier: 'medium' },

  // Tier 4: Specialized models
  { name: 'meta-llama/llama-guard-4-12b', provider: 'groq', model: 'llama-guard-4-12b', cost: 4, tier: 'medium' },
  { name: 'llama-3.1-8b-instant', provider: 'groq', model: 'llama-3.1-8b-instant', cost: 3, tier: 'fast' },

  // Tier 5: Large versatile models
  { name: 'llama-3.3-70b-versatile', provider: 'groq', model: 'llama-3.3-70b-versatile', cost: 5, tier: 'powerful' },
  { name: 'moonshotai/kimi-k2-instruct', provider: 'groq', model: 'kimi-k2-instruct', cost: 5, tier: 'powerful' },

  // Tier 6: Premium OpenAI models (via Groq)
  { name: 'openai/gpt-oss-20b', provider: 'groq', model: 'gpt-oss-20b', cost: 6, tier: 'powerful' },
  { name: 'openai/gpt-oss-safeguard-20b', provider: 'groq', model: 'gpt-oss-safeguard-20b', cost: 6, tier: 'powerful' },
  { name: 'openai/gpt-oss-120b', provider: 'groq', model: 'gpt-oss-120b', cost: 8, tier: 'premium' },

  // Tier 7: Fallback OpenAI models (Direct)
  { name: 'openai/gpt-4o-mini', provider: 'openai', model: 'gpt-4o-mini', cost: 7, tier: 'powerful' },
  { name: 'openai/gpt-4o', provider: 'openai', model: 'gpt-4o', cost: 10, tier: 'premium' },
];

// Track failed models (reset every hour)
const failedModels = new Set();
setInterval(() => failedModels.clear(), 300000); // Clear every 5 minutes

/**
 * Generate explanation using model fallback chain
 */
async function generateExplanation(topic, options = {}) {
  const {
    preferredModel = null,
    skipCache = false,
    maxRetries = 3
  } = options;

  let chain = [...MODEL_CHAIN];

  // If preferred model specified, try it first
  if (preferredModel) {
    const preferred = chain.find(m => m.name === preferredModel);
    if (preferred) {
      chain = [preferred, ...chain.filter(m => m.name !== preferredModel)];
    }
  }

  // Filter out failed models
  chain = chain.filter(m => !failedModels.has(m.name));

  if (chain.length === 0) {
    // Emergency reset: If all models are marked failed, clear the list and try again immediately
    if (failedModels.size > 0) {
      logger.warn('All models marked as failed. Forcing emergency reset of failedModels list.');
      failedModels.clear();
      chain = [...MODEL_CHAIN]; // Re-populate chain
    } else {
      logger.error('All models exhausted or failed (and failedModels was empty)');
      return {
        success: false,
        error: 'All models currently unavailable. Please try again later.',
      };
    }
  }

  // Try each model in order
  for (const modelConfig of chain) {
    try {
      logger.info(`Trying model: ${modelConfig.name} for topic: ${topic}`);

      let result;
      if (modelConfig.provider === 'groq') {
        result = await callGroqModel(topic, modelConfig.model);
      } else if (modelConfig.provider === 'openai') {
        result = await callOpenAIModel(topic, modelConfig.model);
      } else {
        logger.warn(`Unknown provider: ${modelConfig.provider}`);
        continue;
      }

      if (!result.success) {
        logger.warn(`Model ${modelConfig.name} failed:`, result.error);
        failedModels.add(modelConfig.name);
        continue;
      }

      // Validate response
      const validation = validateExplanationResponse(result.content);
      if (!validation.valid) {
        logger.warn(`Model ${modelConfig.name} returned invalid format:`, validation.errors);
        continue;
      }

      // Success! Track usage and return
      await incrementModelCounter(modelConfig.name, result.tokensUsed || 100);

      logger.info(`Successfully generated explanation with ${modelConfig.name}`);

      return {
        success: true,
        content: result.content,
        model: modelConfig.name,
        tokensUsed: result.tokensUsed,
        verified: modelConfig.cost >= 5, // Higher cost models are "verified"
      };

    } catch (error) {
      logger.error(`Error calling model ${modelConfig.name}:`, error);
      failedModels.add(modelConfig.name);
      continue;
    }
  }

  // All models failed
  return {
    success: false,
    error: 'Unable to generate explanation. All models failed or unavailable.',
  };
}

/**
 * Verify/enhance an existing explanation with higher model
 */
async function verifyExplanation(topic, existingContent) {
  // Use higher-tier models for verification (cost >= 5)
  const verificationModels = MODEL_CHAIN.filter(m => m.cost >= 5 && m.tier !== 'fast');

  for (const modelConfig of verificationModels) {
    try {
      logger.info(`Verifying with model: ${modelConfig.name}`);

      let result;
      if (modelConfig.provider === 'groq') {
        result = await callGroqModel(topic, modelConfig.model, existingContent);
      } else if (modelConfig.provider === 'openai') {
        result = await callOpenAIModel(topic, modelConfig.model, existingContent);
      }

      if (result.success) {
        // Validate response
        const validation = validateExplanationResponse(result.content);
        if (!validation.valid) {
          logger.warn(`Verification model ${modelConfig.name} returned invalid format:`, validation.errors);
          continue;
        }

        await incrementModelCounter(modelConfig.name, result.tokensUsed || 200);
        return {
          success: true,
          content: result.content,
          model: modelConfig.name,
        };
      }

    } catch (error) {
      logger.error(`Verification error with ${modelConfig.name}:`, error);
      continue;
    }
  }

  return {
    success: false,
    error: 'Verification failed',
  };
}

module.exports = {
  generateExplanation,
  verifyExplanation,
};
