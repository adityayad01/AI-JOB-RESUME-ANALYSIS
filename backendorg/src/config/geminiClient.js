const { GoogleGenerativeAI } = require("@google/genai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyCC2qR3cVsZyFav7DPfbQhRYJiVuyrEbpo"
);

module.exports = genAI;
