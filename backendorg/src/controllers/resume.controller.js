const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // Read and parse the PDF file
        const fileBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(fileBuffer);
        const resumeText = pdfData.text
            .replace(/\n{2,}/g, "\n")
            .replace(/\s{2,}/g, " ")
            .trim();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // First AI call: Generate Job Recommendations
        const jobPrompt = `
Extract key skills, experience, and qualifications from this resume:
${resumeText}

Recommend 5 suitable job roles with short descriptions, skills, education, and location.
Return as JSON array like:
[
  {
    "title": "Software Engineer",
    "description": "...",
    "skills": ["JavaScript", "React"],
    "education": "B.Tech in CS",
    "location": "Remote"
  }
]
`;
        const jobResult = await model.generateContent(jobPrompt);
        let jobRecommendations;
        try {
            jobRecommendations = JSON.parse(jobResult.response.text().replace(/```json|```/g, "").trim());
        } catch (e) {
            console.error("Job Recommendations JSON parse error:", e);
            jobRecommendations = [{ title: "Parsing Error", description: jobResult.response.text() }];
        }

        // Second AI call: Generate Resume Analysis
        const analysisPrompt = `
Analyze this resume and return JSON with EXACTLY these fields. 
If some information is missing, use "N/A" for text fields.

Format JSON like:

{
  "analysis": {
    "contact": { "email": "...", "phone": "...", "linkedin": "..." },
    "skills": ["..."],
    "education": { "degree": "...", "institution": "...", "graduationYear": "...", "gpa": "..." },
    "experience": [{ "position": "...", "company": "...", "duration": "...", "description": "..." }],
    "qualityScore": {
      "overall": <score from 0-100>,
      "details": { 
        "content": <score from 0-100>, 
        "skills": <score from 0-100>, 
        "experience": <score from 0-100>, 
        "format": <score from 0-100>
      }
    },
    "improvementTips": [
      { "section": "...", "priority": "...", "suggestion": "..." }
    ]
  }
}

Instructions for scoring:
1) Score each section (content, skills, experience, format) from 0-100 based on completeness, relevance, clarity, and format.
2) The "overall" score must be the average of the "content", "skills", "experience", and "format" scores.
3) If a section is partially missing, assign a reasonable score (e.g., 50), not 0.
4) All fields must be present, even if "N/A".

Resume Text:
${resumeText}
`;
        const analysisResult = await model.generateContent(analysisPrompt);
        let parsedAnalysis;
        try {
            const responseText = analysisResult.response.text().replace(/```json|```/g, "").trim();
            parsedAnalysis = JSON.parse(responseText).analysis;
        } catch (e) {
            console.error("Resume Analysis JSON parse error:", e);
            parsedAnalysis = {
                contact: { email: "N/A", phone: "N/A", linkedin: "N/A" },
                skills: [],
                education: { degree: "N/A", institution: "N/A", graduationYear: "N/A", gpa: "N/A" },
                experience: [],
                qualityScore: { overall: 0, details: { content: 0, skills: 0, experience: 0, format: 0 } },
                improvementTips: [],
            };
        }

        // Create a single document with all data
        const newResume = new Resume({
            user: req.user._id,
            originalFileName: req.file.originalname,
            filePath: req.file.path,
            jobRecommendations: jobRecommendations,
            analysis: parsedAnalysis,
        });

        // Save the complete document to the database
        await newResume.save();

        res.status(201).json({
            success: true,
            message: "Resume uploaded and analyzed successfully",
            resume: newResume,
            jobRecommendations: newResume.jobRecommendations,
            analysis: newResume.analysis,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    } finally {
        // Always delete the temporary file after processing
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};



// ----------------------------
// Fetch Job Recommendations for Latest Resume
// ----------------------------
exports.getJobRecommendations = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!resume || !resume.jobRecommendations)
      return res.status(404).json({ message: "No job recommendations found" });

    res.json(resume.jobRecommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------
// Fetch Resume Analysis for Latest Resume
// ----------------------------
exports.getResumeAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!resume || !resume.analysis)
      return res.status(404).json({ message: "No resume analysis found" });

    res.json(resume.analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
        if (!resumes || resumes.length === 0) {
            return res.status(200).json([]);
        }
        res.json(resumes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getSingleResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findById(id);
        if (!resume || resume.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Resume not found or unauthorized." });
        }
        res.json(resume);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Add this function to your controller file (e.g., controllers/resumeController.js)
exports.downloadResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findById(id);

        if (!resume || resume.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Resume not found or unauthorized." });
        }

        // Check if the file path exists and the file is still there
        if (!fs.existsSync(resume.filePath)) {
            return res.status(404).json({ message: "File not found on server." });
        }

        // Send the file to the client for download
        res.download(resume.filePath, resume.originalFileName);

    } catch (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Error downloading file." });
    }
};