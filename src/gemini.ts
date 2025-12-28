{/*export async function analyzeAptitude(
  answers: { answer: string; timeTaken: number }[]
) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AAIzaSyDzeZpKvGixi9C1KjUAn1ywTV60qA9irgk`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
A student answered scenario-based aptitude questions.
Each answer includes the response text and time taken (seconds).

Responses:
${answers
  .map((a, i) => `Q${i + 1}: ${a.answer} (time: ${a.timeTaken}s)`)
  .join("\n")}

Analyze aptitude and ONLY for the streams listed in "recommended_streams", create a detailed educational and career path.
Do NOT create paths for any other streams.
 return STRICT JSON:

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
  "<stream_name>": {
    "intermediate": string,
    "undergraduate": string,
    "postgraduate": string,
    "job_opportunities": string[]
  }
}

  "scenario": string
}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text.match(/\{[\s\S]*\}/)![0]);
  } catch {
    // 🔒 DEMO-SAFE FALLBACK
    return {
  aptitude_scores: {
    problem_solving: { score: 82, insight: "Strong analytical approach." },
    logical_reasoning: { score: 75, insight: "Structured thinking." },
    verbal_communication: { score: 58, insight: "Execution-focused communication." }
  },
  strength_summary: "You are strongest in analytical problem-solving.",
  recommended_streams: [
    { name: "Software Engineering", reason: "Matches logical thinking." },
    { name: "Data Science", reason: "Aligns with analytical skills." }
  ],
  stream_paths: {
    "Software Engineering": {
      intermediate: "Focus on Maths, Physics, basic programming.",
      undergraduate: "B.Tech in CSE / IT.",
      postgraduate: "M.Tech, MS in CS, or specialization in systems.",
      job_opportunities: [
        "Software Developer",
        "Backend Engineer",
        "System Architect"
      ]
    },
    "Data Science": {
      intermediate: "Strong Maths, Statistics, Python basics.",
      undergraduate: "B.Tech / B.Sc in Data Science or CS.",
      postgraduate: "M.Sc / MS in Data Science or AI.",
      job_opportunities: [
        "Data Analyst",
        "Data Scientist",
        "ML Engineer"
      ]
    }
  },
  scenario:
    "You work with data, models, and real-world problem solving daily."
};

  }
}
  */}

  export async function analyzeAptitude(answers: any[]) {
  const res = await fetch("http://localhost:5000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  });

  if (!res.ok) {
    throw new Error("Backend Gemini call failed");
  }

  return await res.json();
}
