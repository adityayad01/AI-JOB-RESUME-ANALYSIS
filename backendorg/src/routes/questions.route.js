const express = require("express");
const multer = require("multer");
const { generateQuestions } = require("../utils/questionGenerator");

const router = express.Router();
const upload = multer();

router.post("/extract", upload.single("resume"), async (req, res) => {
  try {
    // TODO: replace with real resume parsing (pdf-parse/docx)
    const skills = ["JavaScript", "Node.js", "React"];

    const questions = await generateQuestions(skills);

    res.json({ skills, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

module.exports = router;
