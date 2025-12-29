const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { cacheWrapper, hashObject } = require('../utils/cache');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze gap between current skills and job requirements
router.post('/gap', async (req, res) => {
  try {
    const { currentSkills, jobDescription, targetRole } = req.body;

    if (!currentSkills || !jobDescription) {
      return res.status(400).json({ error: 'Current skills and job description are required' });
    }

    // Flatten skills array for analysis
    const allSkills = [
      ...(currentSkills.technical || []),
      ...(currentSkills.soft || []),
      ...(currentSkills.tools || [])
    ];

    // Generate cache key from skills + job description
    const cacheKey = `gap:${hashObject({ allSkills, jobDescription, targetRole })}`;

    const { data: analysis, fromCache } = await cacheWrapper(
      cacheKey,
      7 * 24 * 60 * 60, // Cache for 7 days
      async () => {
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash'
        });

        const prompt = `You are a career gap analyzer. Compare the candidate's current skills against a job description.

CURRENT SKILLS:
${JSON.stringify(allSkills, null, 2)}

JOB DESCRIPTION:
${jobDescription}

TARGET ROLE: ${targetRole || 'Not specified'}

Analyze and provide:

1. REQUIRED SKILLS: Extract all skills mentioned in the JD
2. SKILL GAPS: Identify missing or weak skills
3. IMPORTANCE RANKING: Rate each gap from 1-10 (10 = critical for the role)
4. CURRENT LEVEL vs TARGET LEVEL: For each gap
5. ESTIMATED LEARNING TIME: Hours needed to reach target level
6. HIRING READINESS SCORE: Overall percentage (0-100%) of how ready the candidate is

Return ONLY valid JSON in this format:
{
  "requiredSkills": [
    {
      "name": "React",
      "category": "technical",
      "targetLevel": 4,
      "importance": 9
    }
  ],
  "skillGaps": [
    {
      "skill": "TypeScript",
      "category": "technical",
      "importance": 8,
      "currentLevel": 0,
      "targetLevel": 4,
      "estimatedHours": 40,
      "reason": "Required for frontend development in this role"
    }
  ],
  "matchedSkills": [
    {
      "skill": "JavaScript",
      "currentLevel": 4,
      "targetLevel": 4,
      "status": "proficient"
    }
  ],
  "hiringReadinessScore": 65,
  "summary": "Brief 2-3 sentence summary of the gap analysis"
}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Clean up the response
        let jsonText = response.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/```\n?/g, '');
        }

        try {
          return JSON.parse(jsonText);
        } catch (parseError) {
          console.error('Failed to parse Gemini response:', parseError);
          console.error('Response was:', jsonText);
          throw new Error('Failed to parse AI analysis');
        }
      }
    );

    if (fromCache) {
      console.log('💰 Cache HIT: Saved ~$0.05 on gap analysis');
    } else {
      console.log('💸 Cache MISS: Called LLM for gap analysis (~$0.05)');
    }

    res.json({
      success: true,
      analysis,
      timestamp: new Date(),
      cached: fromCache
    });

  } catch (error) {
    console.error('Gap analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze gap',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get analysis history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    // TODO: Fetch from database
    res.json({
      analyses: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
