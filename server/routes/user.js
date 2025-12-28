const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create new user
router.post('/create', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const user = new User({ username, email });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user XP and level
router.post('/update-xp', async (req, res) => {
  try {
    const { userId, xpGained } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.currentXP += xpGained;
    user.totalXP += xpGained;

    // Level up logic (100 XP per level)
    const xpPerLevel = 100;
    while (user.currentXP >= xpPerLevel) {
      user.level += 1;
      user.currentXP -= xpPerLevel;
    }

    await user.save();

    res.json({
      level: user.level,
      currentXP: user.currentXP,
      totalXP: user.totalXP,
      leveledUp: user.currentXP < xpGained
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
