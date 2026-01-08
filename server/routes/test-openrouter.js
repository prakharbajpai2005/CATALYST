const express = require('express');
const router = express.Router();
const { generateContent } = require('../utils/openrouter');

// Test endpoint to check if API key and model work
router.get('/test', async (req, res) => {
  try {
    // Test with a simple prompt
    const response = await generateContent('Say hello in one sentence');
    
    res.json({
      success: true,
      message: 'OpenRouter API is working correctly!',
      response,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString(),
      hint: 'Check if OPENROUTER_API_KEY is set in .env file'
    });
  }
});

// Test endpoint with custom prompt
router.post('/test', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await generateContent(prompt, model);
    
    res.json({
      success: true,
      prompt,
      response,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
});

module.exports = router;
