const express = require('express');
const router = express.Router();
const upload = require('../middleware/Upload');
const { uploadResume } = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth'); // <-- destructure

// POST /api/resume/upload
router.post('/upload', protect, upload.single('resume'), uploadResume);
// GET /api/resume/test
router.get('/test', (req, res) => {
  res.send('Resume route working ✅');
});

module.exports = router;
