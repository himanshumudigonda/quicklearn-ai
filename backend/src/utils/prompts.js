/**
 * Generate prompt for initial explanation
 */
function generatePrompt(topic) {
  return `You are an expert educational assistant helping students learn quickly.

Explain the following topic in a concise, engaging way suitable for a 1-minute learning session.

Topic: ${topic}

Return your response as a JSON object with these exact keys:
- "one_line": A single-sentence definition (max 20 words)
- "explanation": A clear, simple explanation (50-80 words)
- "analogy": A relatable analogy that makes it memorable (30-50 words)
- "example": A concrete, real-world example (30-50 words)
- "formula": Key formula or principle (if applicable, otherwise empty string)
- "revision_note": A quick 10-second revision reminder (max 15 words)

Keep language simple, warm, and student-friendly. Use active voice. Make it stick!

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
