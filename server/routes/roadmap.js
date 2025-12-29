const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    const prompt = `You are a personalized learning roadmap generator. Create a week-by-week learning plan.

SKILL GAPS TO ADDRESS:
${JSON.stringify(skillGaps, null, 2)}

TARGET ROLE: ${targetRole || 'Not specified'}
AVAILABLE TIME: ${hoursPerWeek} hours per week

Create a realistic, actionable roadmap that:
1. Prioritizes high-importance skills first
2. Breaks learning into weekly chunks
3. Suggests FREE resources (YouTube, documentation, articles, free courses)
4. Includes practice projects/exercises
5. Has realistic time estimates

Return ONLY valid JSON in this format:
{
  "totalWeeks": 12,
  "totalHours": 120,
  "weeklyPlan": [
    {
      "week": 1,
      "title": "React Fundamentals",
      "skills": ["React", "JSX", "Components"],
      "estimatedHours": 10,
      "resources": [
        {
          "title": "React Official Tutorial",
          "url": "https://react.dev/learn",
          "type": "documentation",
          "duration": "3 hours"
        },
        {
          "title": "React Crash Course",
          "url": "https://youtube.com/...",
          "type": "video",
          "duration": "2 hours"
        }
      ],
      "practiceProject": "Build a simple todo app",
      "milestones": ["Understand components", "Create first React app"]
    }
  ],
  "milestones": [
    {
      "week": 4,
      "title": "Complete React Basics",
      "description": "Build a full CRUD application"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean up response
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    try {
      const roadmap = JSON.parse(jsonText);
      
      res.json({
        success: true,
        roadmap,
        generatedAt: new Date()
      });

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Response was:', jsonText);
      throw new Error('Failed to parse AI roadmap');
    }

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
