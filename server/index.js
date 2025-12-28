require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
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

app.use('/api/simulation', simulationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/skill-tree', skillTreeRoutes);
app.use('/api/passport', passportRoutes);

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
