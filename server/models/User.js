const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  level: {
    type: Number,
    default: 1
  },
  totalXP: {
    type: Number,
    default: 0
  },
  currentXP: {
    type: Number,
    default: 0
  },
  skillsCompleted: [{
    skillId: String,
    completedAt: Date,
    score: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
