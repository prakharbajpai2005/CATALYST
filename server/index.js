require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
// Middleware
app.use(cors({
  origin: [
    'https://catalyst-v1.pages.dev',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skill-bridge';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// Routes
const simulationRoutes = require('./routes/simulation');
const userRoutes = require('./routes/user');
const skillTreeRoutes = require('./routes/skillTree');
const passportRoutes = require('./routes/passport');
const resumeRoutes = require('./routes/resume');
const analyzeRoutes = require('./routes/analyze');
const roadmapRoutes = require('./routes/roadmap');

const testOpenRouterRoutes = require('./routes/test-openrouter');

app.use('/api/simulation', simulationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skill-tree', skillTreeRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/test-openrouter', testOpenRouterRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Skill-Bridge API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
