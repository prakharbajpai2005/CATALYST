const express = require('express');
const router = express.Router();
const { generateChainedRoadmap } = require('../utils/promptChain');

// Progressive roadmap generation - streams weeks as they're generated
router.post('/generate-progressive', async (req, res) => {
  try {
    const { skillGaps, targetRole, availableHoursPerWeek } = req.body;

    if (!skillGaps || skillGaps.length === 0) {
      return res.status(400).json({ error: 'Skill gaps are required' });
    }

    const hoursPerWeek = availableHoursPerWeek || 10;

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { generateProgressiveRoadmap } = require('../utils/promptChain');

    // Generate roadmap with progress callbacks
    await generateProgressiveRoadmap(
      skillGaps,
      targetRole,
      hoursPerWeek,
      (event, data) => {
        // Stream each event to client
        res.write(`data: ${JSON.stringify({ event, data })}\n\n`);
      }
    );

    res.write(`data: ${JSON.stringify({ event: 'complete' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Progressive roadmap error:', error);
    res.write(`data: ${JSON.stringify({ event: 'error', error: error.message })}\n\n`);
    res.end();
  }
});

// Generate personalized learning roadmap
router.post('/generate', async (req, res) => {
  try {
    const { skillGaps, targetRole, availableHoursPerWeek } = req.body;

    if (!skillGaps || skillGaps.length === 0) {
      return res.status(400).json({ error: 'Skill gaps are required' });
    }

    const hoursPerWeek = availableHoursPerWeek || 10; // Default 10 hours/week

    // Use chained prompt generation with OpenRouter
    const roadmap = await generateChainedRoadmap(
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
