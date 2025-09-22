const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  extractedData: {
    skills: [String],
    education: [String],
    experience: [String]
  },
  score: Number,
  feedback: String
});

module.exports = mongoose.model('Resume', ResumeSchema);
