import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/analyze", async (req, res) => {
  try {
    const { answers } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
You are an expert career counselor.

Analyze the student's aptitude using:
- scenario-based answers
- time taken to answer

Answers:
${JSON.stringify(answers)}

Return STRICT JSON ONLY:

{
  "aptitude_scores": {
    "problem_solving": { "score": number, "insight": string },
    "logical_reasoning": { "score": number, "insight": string },
    "verbal_communication": { "score": number, "insight": string }
  },
  "strength_summary": string,
  "recommended_streams": [
    { "name": string, "reason": string }
  ],
  "stream_paths": {
    "Stream Name": {
      "intermediate": string,
      "undergraduate": string,
      "postgraduate": string,
      "job_opportunities": string[]
    }
  },
  "scenario": string
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Remove markdown if present
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini analysis failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
