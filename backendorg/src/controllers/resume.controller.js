const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ----------------------------
// Upload Resume & Generate AI Analysis + Job Recommendations
// ----------------------------
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Read resume PDF
    const fileBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    // Create a new Resume document
    const newResume = new Resume({
      user: req.user._id,
      originalFileName: req.file.originalname,
      filePath: req.file.path,
    });

    // Prepare Gemini prompt for both job recommendations and analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze this resume and return JSON with:
      1) Key skills, experience, qualifications
      2) 5 suitable job recommendations with title, description, skills, education, location
      3) Resume Analysis including contact, skills, education, experience, qualityScore, improvementTips

      Format JSON like:
      {
        "jobRecommendations": [
          { "title": "...", "description": "...", "skills": ["..."], "education": "...", "location": "..." }
        ],
        "analysis": {
          "contact": { "email": "...", "phone": "...", "linkedin": "..." },
          "skills": ["..."],
          "education": { "degree": "...", "institution": "...", "graduationYear": "...", "gpa": "..." },
          "experience": [{ "position": "...", "company": "...", "duration": "...", "description": "..." }],
          "qualityScore": { "overall": 77, "details": { "content": 85, "skills": 78, "experience": 72, "format": 80 } },
          "improvementTips": [
            { "section": "Skills", "priority": "high", "suggestion": "..." },
            { "section": "Experience", "priority": "medium", "suggestion": "..." }
          ]
        }
      }

      Resume Text:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json|```/g, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error("JSON parse error:", e);
      parsedData = {
        jobRecommendations: [{ title: "Parsing Error", description: responseText }],
        analysis: null,
      };
    }

    // Save both jobRecommendations & analysis in DB
    newResume.jobRecommendations = parsedData.jobRecommendations || [];
    newResume.analysis = parsedData.analysis || null;

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
