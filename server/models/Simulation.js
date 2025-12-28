const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillId: {
    type: String,
    required: true
  },
  mission: {
    title: String,
    description: String,
    task: String,
    resources: mongoose.Schema.Types.Mixed // Can be emails, code, data, etc.
  },
  userResponses: [{
    input: String,
    timestamp: Date,
    feedback: {
      score: Number,
      correctness: String,
      fluency: String,
      suggestions: String
    }
  }],
  finalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('Simulation', simulationSchema);
