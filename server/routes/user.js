const express = require('express');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require('bcryptjs');

// Create new user (Sign Up)
router.post('/create', async (req, res) => {
  try {
    const { username, email, password, goodname } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ 
      username, 
      email, 
      password: hashedPassword,
      goodname 
    });
    
    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // If user has no password (e.g. OAuth user trying to login with password), fail
    if (!user.password) {
      return res.status(400).json({ error: 'Please sign in with your social account' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
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
