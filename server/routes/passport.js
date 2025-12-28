const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Simulation = require('../models/Simulation');
const SkillTree = require('../models/SkillTree');

// Generate skill passport data
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get simulation history
    const simulations = await Simulation.find({ userId, completed: true })
      .sort({ completedAt: -1 });

    // Get skill tree
    const skillTree = await SkillTree.findOne({ userId });

    // Calculate statistics
    const totalSimulations = simulations.length;
    const averageScore = totalSimulations > 0
      ? Math.round(simulations.reduce((sum, sim) => sum + sim.finalScore, 0) / totalSimulations)
      : 0;

    const skillBreakdown = simulations.reduce((acc, sim) => {
      if (!acc[sim.skillId]) {
        acc[sim.skillId] = {
          count: 0,
          totalScore: 0,
          bestScore: 0
        };
      }
      acc[sim.skillId].count += 1;
      acc[sim.skillId].totalScore += sim.finalScore;
      acc[sim.skillId].bestScore = Math.max(acc[sim.skillId].bestScore, sim.finalScore);
      return acc;
    }, {});

    // Format skill breakdown
    const skills = Object.entries(skillBreakdown).map(([skillId, data]) => ({
      skillId,
      completedMissions: data.count,
      averageScore: Math.round(data.totalScore / data.count),
      bestScore: data.bestScore
    }));

    const passport = {
      user: {
        username: user.username,
        email: user.email,
        level: user.level,
        totalXP: user.totalXP
      },
      statistics: {
        totalMissionsCompleted: totalSimulations,
        averageScore,
        skillsMastered: skills.filter(s => s.averageScore >= 80).length,
        totalTimeInvested: `${totalSimulations * 15} minutes` // Estimate 15 min per mission
      },
      skills,
      recentAchievements: simulations.slice(0, 5).map(sim => ({
        skillId: sim.skillId,
        missionTitle: sim.mission.title,
        score: sim.finalScore,
        completedAt: sim.completedAt
      })),
      generatedAt: new Date()
    };

    res.json(passport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
