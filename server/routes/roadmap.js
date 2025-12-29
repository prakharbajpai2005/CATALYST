const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateChainedRoadmap } = require('../utils/promptChain');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate personalized learning roadmap
router.post('/generate', async (req, res) => {
  try {
    const { skillGaps, targetRole, availableHoursPerWeek } = req.body;

    if (!skillGaps || skillGaps.length === 0) {
      return res.status(400).json({ error: 'Skill gaps are required' });
    }

    const hoursPerWeek = availableHoursPerWeek || 10; // Default 10 hours/week

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    // Use chained prompt generation for better performance and caching
    const roadmap = await generateChainedRoadmap(
      model,
      skillGaps,
      targetRole,
      hoursPerWeek
    );

    res.json({
      success: true,
      roadmap,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate roadmap',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update progress for a week
router.post('/progress', async (req, res) => {
  try {
    const { userId, week, completed } = req.body;
    
    // TODO: Store in database
    res.json({
      success: true,
      week,
      completed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
