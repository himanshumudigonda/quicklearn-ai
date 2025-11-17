const OpenAI = require('openai');
const logger = require('../../utils/logger');
const { generatePrompt, generateVerificationPrompt } = require('../../utils/prompts');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

// Model configurations for GPT-OSS and OpenAI models
const MODEL_CONFIGS = {
  // GPT-OSS models from OpenAI
  'gpt-oss-120b': {
    name: 'openai/gpt-oss-120b',
    temperature: 1.0,
    max_tokens: 8192,
    reasoning_effort: 'high',
    stream: false,
  },
  'gpt-oss-20b': {
    name: 'openai/gpt-oss-20b',
    temperature: 1.0,
    max_tokens: 8192,
    reasoning_effort: 'medium',
    stream: false,
  },
  'gpt-oss-safeguard-20b': {
    name: 'openai/gpt-oss-safeguard-20b',
    temperature: 1.0,
    max_tokens: 8192,
    reasoning_effort: 'medium',
    stream: false,
  },
  
  // Standard OpenAI models (fallback)
  'gpt-4o': {
    name: 'gpt-4o',
    temperature: 0.7,
    max_tokens: 4096,
    stream: false,
  },
  'gpt-4o-mini': {
    name: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 4096,
    stream: false,
  },
};

async function callOpenAIModel(topic, modelAlias = 'gpt-4o-mini', existingContent = null) {
  try {
    const config = MODEL_CONFIGS[modelAlias];
    if (!config) {
      logger.error(`Unknown model alias: ${modelAlias}`);
      return { success: false, error: `Unknown model: ${modelAlias}` };
    }

    const prompt = existingContent 
      ? generateVerificationPrompt(topic, existingContent)
      : generatePrompt(topic);

    const messages = [
      {
        role: 'system',
        content: 'You are an expert educational assistant. Return only valid JSON responses with the following structure: {"one_line": "...", "explanation": "...", "analogy": "...", "example": "...", "formula": "...", "revision_note": "..."}',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    // Build completion parameters
    const completionParams = {
      messages,
      model: config.name,
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      stream: config.stream,
      response_format: { type: 'json_object' },
    };

    // Add reasoning_effort for GPT-OSS models
    if (config.reasoning_effort) {
      completionParams.reasoning_effort = config.reasoning_effort;
    }

    logger.info(`Calling OpenAI model: ${config.name}`);
    const completion = await openai.chat.completions.create(completionParams);

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: 'Empty response from model' };
    }

    const parsed = JSON.parse(content);

    // Validate required fields
    const requiredFields = ['one_line', 'explanation', 'analogy', 'example'];
    const missingFields = requiredFields.filter(field => !parsed[field]);
    
    if (missingFields.length > 0) {
      logger.warn(`Model ${modelAlias} missing fields: ${missingFields.join(', ')}`);
      // Fill in missing fields with defaults
      missingFields.forEach(field => {
        parsed[field] = `[${field} not provided]`;
      });
    }

    return {
      success: true,
      content: parsed,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: config.name,
    };

  } catch (error) {
    logger.error(`OpenAI model ${modelAlias} error:`, {
      message: error.message,
      model: MODEL_CONFIGS[modelAlias]?.name,
      stack: error.stack,
    });
    
    return {
      success: false,
      error: error.message,
      model: MODEL_CONFIGS[modelAlias]?.name,
    };
  }
}

// Get list of available models
function getAvailableModels() {
  return Object.keys(MODEL_CONFIGS);
}

// Get model configuration
function getModelConfig(modelAlias) {
  return MODEL_CONFIGS[modelAlias];
}

module.exports = {
  callOpenAIModel,
  getAvailableModels,
  getModelConfig,
};
