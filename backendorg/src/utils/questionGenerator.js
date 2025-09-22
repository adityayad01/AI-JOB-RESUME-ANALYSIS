const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔹 Predefined question bank
const QUESTIONS_BY_SKILL = {
  JavaScript: [
    "What are closures in JavaScript?",
    "Explain the event loop in JavaScript.",
  ],
  React: [
    "What is the difference between class and functional components?",
    "Explain React hooks.",
  ],
  Python: [
    "What are Python decorators?",
    "How do you handle exceptions in Python?",
  ],
};

// 🔹 AI fallback (Gemini)
const generateGeminiQuestions = async (skills) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate 3 technical interview questions for each of the following skills: ${skills.join(
    ", "
  )}. 
Return as valid JSON with this format:
{
 "SkillName": ["Q1", "Q2", "Q3"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse Gemini response:", text);
    return {};
  }
};

// 🔹 Hybrid generator
const generateQuestions = async (skills) => {
  const knownSkills = skills.filter((s) => QUESTIONS_BY_SKILL[s]);
  const unknownSkills = skills.filter((s) => !QUESTIONS_BY_SKILL[s]);

  let questions = [];

  // Rule-based for known
  knownSkills.forEach((skill) => {
    questions.push(...QUESTIONS_BY_SKILL[skill]);
  });

  // Gemini for unknown
  if (unknownSkills.length > 0) {
    const aiGenerated = await generateGeminiQuestions(unknownSkills);
    Object.values(aiGenerated).forEach((qs) => {
      questions.push(...qs);
    });
  }

  return questions;
};

module.exports = { generateQuestions };
