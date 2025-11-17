const Joi = require('joi');

/**
 * Schema for explanation response
 */
const explanationSchema = Joi.object({
  one_line: Joi.string().required().max(200),
  explanation: Joi.string().required().max(1000),
  analogy: Joi.string().required().max(500),
  example: Joi.string().required().max(500),
  formula: Joi.string().allow('').max(300),
  revision_note: Joi.string().required().max(200),
  verified: Joi.boolean().optional(),
});

/**
 * Validate explanation response
 */
function validateExplanationResponse(content) {
  const { error, value } = explanationSchema.validate(content);
  
  if (error) {
    return {
      valid: false,
      errors: error.details.map(d => d.message),
    };
  }

  return {
    valid: true,
    data: value,
  };
}

/**
 * Sanitize user input to prevent prompt injection
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, 200) // Max length
    .replace(/[{}[\]]/g, '') // Remove braces
    .replace(/\n\n+/g, '\n'); // Collapse multiple newlines
}

module.exports = {
  validateExplanationResponse,
  sanitizeInput,
  explanationSchema,
};
