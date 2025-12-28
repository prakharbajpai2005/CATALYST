const mongoose = require('mongoose');

const skillNodeSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  category: String, // e.g., "Project Management", "Python", "Data Science"
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  xpReward: Number,
  prerequisites: [String], // Array of skill IDs
  isUnlocked: {
    type: Boolean,
    default: false
  },
  position: {
    x: Number,
    y: Number
  }
});

const skillTreeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [skillNodeSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SkillTree', skillTreeSchema);
