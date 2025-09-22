const express = require('express');
const router = express.Router();
const upload = require('../middleware/Upload');
const { 
    uploadResume, 
    getJobRecommendations, 
    getResumeAnalysis,
    getAllResumes,
    getSingleResume
} = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth');

// POST /api/resume/upload - Uploads and analyzes a new resume
router.post('/upload', protect, upload.single('resume'), uploadResume);

// GET /api/resume/recommendations - Fetches job recommendations for the latest resume
router.get('/recommendations', protect, getJobRecommendations);

// GET /api/resume/analysis - Fetches the detailed resume analysis for the latest resume
router.get('/analysis', protect, getResumeAnalysis);
router.get("/all", protect, getAllResumes); // New route to get a list of all resumes
router.get("/:id", protect, getSingleResume); 

// GET /api/resume/test
router.get('/test', (req, res) => {
    res.send('Resume route working ✅');
});
// New route to get a single resume by its ID
// GET /api/resume/my-resumes - Fetches all resumes for the authenticated user
//router.get('/my-resumes', protect, getMyResumes);

// DELETE /api/resume/:id - Deletes a specific resume
//router.delete('/:id', protect, deleteResume);

module.exports = router;