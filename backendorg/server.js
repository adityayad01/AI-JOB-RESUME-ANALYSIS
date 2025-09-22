const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./src/middleware/error'); // Your custom error handler
require('dotenv').config(); // Load .env variables

// Environment variables with fallbacks
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeDB';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.status(200).json({ success: true, message: 'Backend connected successfully!' });
});

// Route files
const authRoutes = require('./src/routes/auth.route');
const resumeRoutes = require('./src/routes/resume.route');
const userRoutes = require("./src/routes/user.route");
const extractRoutes = require('./src/routes/questions.route');
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', extractRoutes);
// Error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
