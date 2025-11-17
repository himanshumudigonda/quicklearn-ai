const Groq = require('groq-sdk');
const logger = require('../../utils/logger');
const { generatePrompt, generateVerificationPrompt } = require('../../utils/prompts');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Model configurations matching Python examples
const MODEL_CONFIGS = {
  // Compound models - primary for fast generation
  'compound-mini': {
    name: 'groq/compound-mini',
    temperature: 1.0,
    max_tokens: 1024,
    stream: false,
  },
  'compound': {
    name: 'groq/compound',
    temperature: 1.0,
    max_tokens: 1024,
    stream: false,
  },
  'compound-custom': {
    name: 'groq/compound',
    temperature: 1.0,
    max_tokens: 1024,
    stream: false,
    tools: ['web_search', 'code_interpreter', 'visit_website'],
  },
  
  // Qwen models
  'qwen3-32b': {
    name: 'qwen/qwen3-32b-instruct',
    temperature: 0.6,
    max_tokens: 4096,
    top_p: 0.95,
    stream: false,
  },
  
  // Llama 4 models
  'llama-4-scout-17b': {
    name: 'meta-llama/llama-4-scout-17b',
    temperature: 0.6,
    max_tokens: 4096,
    stream: false,
  },
  'llama-4-maverick-17b-128e': {
    name: 'meta-llama/llama-4-maverick-17b-128e',
    temperature: 0.6,
    max_tokens: 4096,
    stream: false,
  },
  
  // Llama Guard models
  'llama-guard-4-12b': {
    name: 'meta-llama/llama-guard-4-12b',
    temperature: 0.6,
    max_tokens: 4096,
    stream: false,
  },
  
  // Llama Prompt Guard models (special-purpose)
  'llama-prompt-guard-2-22m': {
    name: 'meta-llama/llama-prompt-guard-2-22m',
    temperature: 0.6,
    max_tokens: 4096,
    stream: false,
  },
  'llama-prompt-guard-2-86m': {
    name: 'meta-llama/llama-prompt-guard-2-86m',
    temperature: 0.6,
    max_tokens: 4096,
    stream: false,
  },
  
  // Llama 3.1 models
  'llama-3.1-8b-instant': {
    name: 'llama-3.1-8b-instant',
    temperature: 0.6,
    max_tokens: 4096,
    stream: false,
  },
  
  // Llama 3.3 models
  'llama-3.3-70b-versatile': {
    name: 'llama-3.3-70b-versatile',
    temperature: 0.6,
    max_tokens: 8192,
    stream: false,
  },
  
  // Moonshot Kimi models
  'kimi-k2-instruct': {
    name: 'moonshotai/kimi-k2-instruct',
    temperature: 0.6,
    max_tokens: 4096,
    stream: false,
  },
};

async function callGroqModel(topic, modelAlias = 'compound-mini', existingContent = null) {
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

    // Add optional parameters
    if (config.top_p !== undefined) {
      completionParams.top_p = config.top_p;
    }

    // Add tools for compound-custom
    if (config.tools) {
      completionParams.tools = config.tools.map(tool => ({
        type: 'function',
        function: {
          name: tool,
          description: `Use ${tool} capability`,
        },
      }));
    }

    logger.info(`Calling Groq model: ${config.name}`);
    const completion = await groq.chat.completions.create(completionParams);

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
    logger.error(`Groq model ${modelAlias} error:`, {
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
  callGroqModel,
  getAvailableModels,
  getModelConfig,
};
