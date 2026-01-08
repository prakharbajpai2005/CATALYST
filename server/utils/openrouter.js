// OpenRouter AI utility - supports multiple models with higher rate limits
const OpenAI = require('openai');

let openRouterClient = null;

/**
 * Initialize OpenRouter client
 */
function getOpenRouterClient() {
  if (openRouterClient) return openRouterClient;

  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not found in environment variables');
  }

  openRouterClient = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
    defaultHeaders: {
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'Skill-Bridge',
    }
  });

  return openRouterClient;
}

/**
 * Generate content using OpenRouter
 * @param {string} prompt - The prompt to send
 * @param {string} model - Model to use (default: openai/gpt-3.5-turbo)
 * @returns {Promise<string>} - Generated text
 */
async function generateContent(prompt, model = 'openai/gpt-3.5-turbo') {
  const client = getOpenRouterClient();

  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw error;
  }
}

/**
 * Retry wrapper for API calls with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error.message?.includes('429') || 
                          error.message?.includes('quota') ||
                          error.message?.includes('Too Many Requests');
      
      if (!isRateLimit || attempt === maxRetries - 1) {
        throw error;
      }

      let retryDelay = 20000;
      const retryMatch = error.message?.match(/retry in ([\d.]+)s/i);
      if (retryMatch) {
        retryDelay = Math.ceil(parseFloat(retryMatch[1]) * 1000);
      } else {
        retryDelay = 20000 * Math.pow(2, attempt);
      }

      console.log(`⏳ Rate limit hit. Retrying in ${retryDelay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

module.exports = {
  getOpenRouterClient,
  generateContent,
  retryWithBackoff
};
