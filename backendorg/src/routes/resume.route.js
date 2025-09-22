const express = require('express');
const router = express.Router();
const upload = require('../middleware/Upload');
const { 
    uploadResume, 
    getJobRecommendations, 
    getResumeAnalysis 
} = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth');

// POST /api/resume/upload - Uploads and analyzes a new resume
router.post('/upload', protect, upload.single('resume'), uploadResume);

// GET /api/resume/recommendations - Fetches job recommendations for the latest resume
router.get('/recommendations', protect, getJobRecommendations);

// GET /api/resume/analysis - Fetches the detailed resume analysis for the latest resume
router.get('/analysis', protect, getResumeAnalysis);

// GET /api/resume/test
router.get('/test', (req, res) => {
    res.send('Resume route working ✅');
});

module.exports = router;