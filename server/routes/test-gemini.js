const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test endpoint to check if API key and model work
router.get('/test', async (req, res) => {
  try {
    // Test with the flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Say hello in one sentence');
    const response = result.response.text();
    
    res.json({
      success: true,
      message: 'Gemini API is working correctly!',
      model: 'gemini-2.5-flash',
      response,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString(),
      hint: 'Check if GEMINI_API_KEY is set in .env file'
    });
  }
});

// Test endpoint with custom prompt
router.post('/test', async (req, res) => {
  try {
    const { prompt, model: modelName } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ 
      model: modelName || 'gemini-2.5-flash' 
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    res.json({
      success: true,
      model: modelName || 'gemini-2.5-flash',
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
