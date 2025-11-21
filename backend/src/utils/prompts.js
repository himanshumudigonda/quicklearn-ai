/**
 * Generate prompt for initial explanation
 */
function generatePrompt(topic) {
  return `You are a friendly teacher explaining things to a 5-year-old.

Explain the following topic in the simplest way possible. Use easy words. No jargon.

Topic: ${topic}

Return your response as a JSON object with these exact keys:
- "one_line": A very simple definition (max 15 words).
- "explanation": A fun, simple explanation like you are talking to a child (50-80 words).
- "analogy": A simple comparison using everyday things like toys, food, or animals (30-50 words).
- "example": A real-life example a child would understand (30-50 words).
- "formula": Key formula (only if really needed, otherwise empty string).
- "revision_note": A super short reminder (max 10 words).

Keep it fun, warm, and super easy to understand!

Return ONLY the JSON object, no other text.`;
}

/**
 * Generate verification/enhancement prompt
 */
function generateVerificationPrompt(topic, existingContent) {
  return `You are an educational verifier tasked with reviewing and improving explanations.

Topic: ${topic}

Existing explanation:
${JSON.stringify(existingContent, null, 2)}

Review this explanation for:
1. Factual accuracy
2. Clarity and simplicity
3. Engagement and memorability
4. Completeness

Improve the explanation while keeping the same JSON structure. If any information is incorrect, fix it. If anything is unclear, clarify it. Keep it concise and student-friendly.

Return the improved JSON with these exact keys:
- "one_line": Improved single-sentence definition
- "explanation": Enhanced explanation
- "analogy": Better analogy (if needed)
- "example": Clearer example
- "formula": Verified formula (if applicable)
- "revision_note": Refined revision reminder
- "verified": Set to true

Return ONLY the JSON object, no other text.`;
}

module.exports = {
  generatePrompt,
  generateVerificationPrompt,
};
