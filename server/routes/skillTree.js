const express = require('express');
const router = express.Router();
const SkillTree = require('../models/SkillTree');

// Default skill tree template
const DEFAULT_SKILL_TREE = [
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Master sprint planning, stakeholder management, and agile methodologies',
    category: 'Management',
    difficulty: 'beginner',
    xpReward: 150,
    prerequisites: [],
    isUnlocked: true,
    position: { x: 100, y: 100 }
  },
  {
    id: 'python',
    name: 'Python Fundamentals',
    description: 'Learn Python basics, debugging, and data structures',
    category: 'Programming',
    difficulty: 'beginner',
    xpReward: 120,
    prerequisites: [],
    isUnlocked: true,
    position: { x: 300, y: 100 }
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Analyze datasets, create visualizations, and derive insights',
    category: 'Data Science',
    difficulty: 'intermediate',
    xpReward: 200,
    prerequisites: ['python'],
    isUnlocked: false,
    position: { x: 300, y: 250 }
  },
  {
    id: 'advanced-pm',
    name: 'Advanced PM',
    description: 'Handle complex projects, risk management, and cross-functional teams',
    category: 'Management',
    difficulty: 'advanced',
    xpReward: 250,
    prerequisites: ['project-management'],
    isUnlocked: false,
    position: { x: 100, y: 250 }
  }
];

// Get or create skill tree for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let skillTree = await SkillTree.findOne({ userId });

    // Create default skill tree if doesn't exist
    if (!skillTree) {
      skillTree = new SkillTree({
        userId,
        skills: DEFAULT_SKILL_TREE
      });
      await skillTree.save();
    }

    res.json(skillTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlock a skill
router.post('/unlock', async (req, res) => {
  try {
    const { userId, skillId } = req.body;

    const skillTree = await SkillTree.findOne({ userId });
    if (!skillTree) {
      return res.status(404).json({ error: 'Skill tree not found' });
    }

    const skill = skillTree.skills.find(s => s.id === skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Check prerequisites
    const prerequisitesMet = skill.prerequisites.every(prereqId => {
      const prereq = skillTree.skills.find(s => s.id === prereqId);
      return prereq && prereq.isUnlocked;
    });

    if (!prerequisitesMet) {
      return res.status(400).json({ error: 'Prerequisites not met' });
    }

    skill.isUnlocked = true;
    skillTree.updatedAt = new Date();
    await skillTree.save();

    res.json({ message: 'Skill unlocked', skill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
