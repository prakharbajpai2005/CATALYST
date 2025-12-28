const express = require('express');
const router = express.Router();
const Simulation = require('../models/Simulation');

// Mock LLM System Prompt and Logic
const SIMULATION_SYSTEM_PROMPT = `You are an AI Simulation Engine for Skill-Bridge, a platform that teaches through realistic workplace scenarios.

Your role:
1. Generate realistic workplace missions based on the requested skill
2. Provide relevant tasks and resources (mock emails, data, code snippets)
3. Evaluate user responses and provide constructive feedback
4. Assign skill scores (0-100) based on:
   - Correctness (40%): Did they solve the problem correctly?
   - Approach (30%): Did they use best practices?
   - Communication (30%): Was their explanation clear?

Always be encouraging but honest. Focus on practical, real-world application.`;

// Hardcoded Demo Mission for the prototype
const DEMO_MISSIONS = {
  'project-management': {
    title: 'Sprint Planning Crisis',
    description: 'Your team is behind schedule and stakeholders are demanding updates. You need to re-prioritize the sprint backlog.',
    task: 'Review the current sprint backlog and propose a new prioritization strategy. Explain your reasoning.',
    resources: {
      emails: [
        {
          from: 'ceo@company.com',
          subject: 'Urgent: Product Launch Deadline',
          body: 'We need the authentication feature live by Friday. This is non-negotiable.'
        },
        {
          from: 'lead-dev@company.com',
          subject: 'Technical Debt Warning',
          body: 'The payment integration is unstable. We need to refactor before adding new features.'
        }
      ],
      backlog: [
        { id: 1, task: 'User Authentication', points: 8, priority: 'high' },
        { id: 2, task: 'Payment Integration', points: 13, priority: 'medium' },
        { id: 3, task: 'Email Notifications', points: 5, priority: 'low' },
        { id: 4, task: 'Refactor Payment Module', points: 8, priority: 'medium' }
      ]
    }
  },
  'python': {
    title: 'Data Pipeline Bug',
    description: 'The ETL pipeline is failing in production. You need to debug and fix it.',
    task: 'Identify the bug in the code and provide a corrected version with explanation.',
    resources: {
      code: `
def process_data(data):
    results = []
    for item in data:
        if item['value'] > 0:
            results.append(item['value'] * 2)
    return sum(results) / len(data)  # Bug is here!

data = [{'value': 10}, {'value': -5}, {'value': 20}]
print(process_data(data))
      `,
      error: 'ZeroDivisionError: division by zero'
    }
  }
};

// Mock LLM evaluation function
function evaluateResponse(skillId, userInput) {
  // This is a simplified mock. In production, this would call an actual LLM API
  const responses = {
    'project-management': {
      good: {
        score: 85,
        correctness: 'Excellent prioritization! You correctly identified that authentication is critical for the launch.',
        fluency: 'Clear and well-structured explanation.',
        suggestions: 'Consider adding a timeline for addressing technical debt after the launch.'
      },
      medium: {
        score: 60,
        correctness: 'You identified some priorities but missed the urgency of the authentication feature.',
        fluency: 'Explanation could be more structured.',
        suggestions: 'Always align technical decisions with business deadlines. Re-read the CEO email.'
      },
      poor: {
        score: 30,
        correctness: 'Prioritization does not align with business needs.',
        fluency: 'Unclear reasoning.',
        suggestions: 'Focus on understanding stakeholder requirements first.'
      }
    },
    'python': {
      good: {
        score: 90,
        correctness: 'Perfect! You identified the division by zero issue and fixed it correctly.',
        fluency: 'Code is clean and well-explained.',
        suggestions: 'Consider adding error handling for edge cases.'
      },
      medium: {
        score: 55,
        correctness: 'You found the bug but the fix is incomplete.',
        fluency: 'Code works but could be cleaner.',
        suggestions: 'Think about what happens when the filtered list is empty.'
      },
      poor: {
        score: 25,
        correctness: 'Did not identify the core issue.',
        fluency: 'Code has syntax errors.',
        suggestions: 'Review Python error messages carefully and trace the execution.'
      }
    }
  };

  // Simple heuristic for demo: check input length and keywords
  const input = userInput.toLowerCase();
  const isGood = input.length > 100 && (
    input.includes('authentication') || 
    input.includes('len(results)') ||
    input.includes('priority')
  );
  const isMedium = input.length > 50;

  const quality = isGood ? 'good' : (isMedium ? 'medium' : 'poor');
  return responses[skillId]?.[quality] || responses[skillId]?.poor;
}

// Start a new simulation
router.post('/start', async (req, res) => {
  try {
    const { userId, skillId } = req.body;

    if (!userId || !skillId) {
      return res.status(400).json({ error: 'userId and skillId are required' });
    }

    const mission = DEMO_MISSIONS[skillId];
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found for this skill' });
    }

    const simulation = new Simulation({
      userId,
      skillId,
      mission,
      userResponses: []
    });

    await simulation.save();

    res.json({
      simulationId: simulation._id,
      mission: {
        title: mission.title,
        description: mission.description,
        task: mission.task,
        resources: mission.resources
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit user response and get feedback
router.post('/respond', async (req, res) => {
  try {
    const { simulationId, userInput } = req.body;

    if (!simulationId || !userInput) {
      return res.status(400).json({ error: 'simulationId and userInput are required' });
    }

    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    // Get AI feedback (mocked)
    const feedback = evaluateResponse(simulation.skillId, userInput);

    // Save response
    simulation.userResponses.push({
      input: userInput,
      timestamp: new Date(),
      feedback
    });

    // Update final score (average of all responses)
    const avgScore = simulation.userResponses.reduce((sum, r) => sum + r.feedback.score, 0) / simulation.userResponses.length;
    simulation.finalScore = Math.round(avgScore);

    await simulation.save();

    res.json({
      feedback,
      currentScore: simulation.finalScore,
      totalResponses: simulation.userResponses.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete simulation
router.post('/complete', async (req, res) => {
  try {
    const { simulationId } = req.body;

    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    simulation.completed = true;
    simulation.completedAt = new Date();
    await simulation.save();

    res.json({
      message: 'Simulation completed',
      finalScore: simulation.finalScore,
      xpEarned: Math.round(simulation.finalScore * 1.5) // XP = score * 1.5
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get simulation history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const simulations = await Simulation.find({ userId }).sort({ startedAt: -1 });
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
