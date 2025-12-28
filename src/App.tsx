import { useState } from "react";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebase";
import { quizQuestions } from "./quizData";
import { analyzeAptitude } from "./gemini";
import MapView from "./MapView";
import "./styles.css";

type AnswerType = {
  answer: string;
  timeTaken: number;
};

export default function App() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [result, setResult] = useState<any>(null);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const exitJourney = () => {
  setName("");
  setAnswers([]);
  setResult(null);
  setSelectedStream(null);
  setQIndex(0);
  setStartTime(Date.now());
};
const calculateConfidence = (stream: string) => {
  if (!result) return 0;

  const ps = result.aptitude_scores.problem_solving.score;
  const lr = result.aptitude_scores.logical_reasoning.score;
  const vc = result.aptitude_scores.verbal_communication.score;

  if (stream === "Engineering") {
    return Math.round(ps * 0.6 + lr * 0.4);
  }

  if (stream === "Data Science") {
    return Math.round(lr * 0.5 + ps * 0.5);
  }

  if (stream === "Management") {
    return Math.round(vc * 0.6 + lr * 0.4);
  }

  return 50;
};



  /* ---------- AUTH ---------- */
  const login = async () => {
    const res = await signInAnonymously(auth);
    await updateProfile(res.user, { displayName: name });
  };

  /* ---------- QUIZ ---------- */
  const answerQuestion = (option: string) => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const updated = [...answers, { answer: option, timeTaken }];
    setAnswers(updated);
    setStartTime(Date.now());

    if (qIndex < quizQuestions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      submitQuiz(updated);
    }
  };

  const submitQuiz = async (finalAnswers: AnswerType[]) => {
    const analysis = {
  strength_summary: "Strong logical thinking with balanced communication skills.",
  aptitude_scores: {
    problem_solving: {
      score: 78,
      insight: "You approach problems methodically and stay calm under pressure."
    },
    logical_reasoning: {
      score: 82,
      insight: "You identify patterns quickly and reason with clarity."
    },
    verbal_communication: {
      score: 70,
      insight: "You communicate ideas clearly with room to grow in persuasion."
    }
  },
  recommended_streams: [
    { name: "Engineering" },
    { name: "Data Science" },
    { name: "Management" }
  ],
  stream_paths: {
    Engineering: {
      intermediate: "MPC with focus on Mathematics & Physics",
      undergraduate: "B.Tech / BE in core engineering fields",
      postgraduate: "M.Tech / MS specialization",
      job_opportunities: [
        "Software Engineer",
        "Core Engineer",
        "Systems Analyst"
      ]
    },
    "Data Science": {
      intermediate: "MPC with Statistics basics",
      undergraduate: "BSc / BTech in Data-related fields",
      postgraduate: "MS in Data Science / AI",
      job_opportunities: [
        "Data Analyst",
        "ML Engineer",
        "AI Researcher"
      ]
    },
    Management: {
      intermediate: "Any stream with leadership activities",
      undergraduate: "BBA / BBM",
      postgraduate: "MBA",
      job_opportunities: [
        "Business Analyst",
        "Product Manager",
        "Operations Manager"
      ]
    }
  },
  scenario:
    "You work in a fast-paced environment, solving real-world problems with a multidisciplinary team."
};

    setResult(analysis);

    await addDoc(collection(db, "aptitude_results"), {
      name,
      answers: finalAnswers,
      analysis
    });
  };

  /* ---------- LOGIN UI ---------- */
  if (!name) {
    return (
      <div className="container">
        <h1>VidhyaSarathi.ai</h1>
        <input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={login} disabled={!name}>
          Start Journey
        </button>
      </div>
    );
  }

  /* ---------- QUIZ UI ---------- */
  if (!result) {
    const currentQuestion = quizQuestions[qIndex];

    return (
      <div className="container">
        <h2>Aptitude Quiz</h2>
        <p>
          <b>
            Question {qIndex + 1} of {quizQuestions.length}
          </b>
        </p>
        <p>{currentQuestion.question}</p>

        {currentQuestion.options.map((option: string) => (
          <button key={option} onClick={() => answerQuestion(option)}>
            {option}
          </button>
        ))}
      </div>
    );
  }

  /* ---------- RESULT UI ---------- */
  return (
    <div className="container">
      <h2>Your Aptitude Assessment</h2>
      <button
  style={{ background: "#dc2626", marginBottom: 12 }}
  onClick={exitJourney}
>
  🚪 Exit & Restart Journey
</button>

      <p>
        <b>{result.strength_summary}</b>
      </p>

      <h3>Your Aptitude Profile</h3>
      <ul>
        <li>
          🧠 <b>Problem Solving:</b>{" "}
          {result.aptitude_scores.problem_solving.score}/100
          <br />
          → {result.aptitude_scores.problem_solving.insight}
        </li>
        <li>
          📊 <b>Logical Reasoning:</b>{" "}
          {result.aptitude_scores.logical_reasoning.score}/100
          <br />
          → {result.aptitude_scores.logical_reasoning.insight}
        </li>
        <li>
          🗣️ <b>Verbal Communication:</b>{" "}
          {result.aptitude_scores.verbal_communication.score}/100
          <br />
          → {result.aptitude_scores.verbal_communication.insight}
        </li>
      </ul>

      <h3>Recommended Career Streams</h3>
      {result.recommended_streams.map((stream: any) => (
        <button
          key={stream.name}
          onClick={() => setSelectedStream(stream.name)}
        >
          {stream.name}
        </button>
      ))}

      {!selectedStream && (
        <p style={{ marginTop: 12, fontSize: 14, color: "#555" }}>
          👆 Select a stream to explore its detailed career path
        </p>
      )}

      {selectedStream && (
  <div className="card">
    <h3>{selectedStream} – Confidence Meter</h3>

    {(() => {
      const confidence = calculateConfidence(selectedStream);

      return (
        <>
          <div
            style={{
              background: "#e5e7eb",
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 8
            }}
          >
            <div
              style={{
                width: `${confidence}%`,
                height: 14,
                background:
                  confidence > 75
                    ? "#16a34a"
                    : confidence > 50
                    ? "#eab308"
                    : "#dc2626"
              }}
            />
          </div>

          <p>
            Confidence Level: <b>{confidence}%</b>
          </p>

          <p style={{ fontSize: 13, color: "#555" }}>
            {confidence > 75 &&
              "Strong alignment with your aptitude strengths."}
            {confidence <= 75 &&
              confidence > 50 &&
              "Moderate fit. Skill improvement needed."}
            {confidence <= 50 &&
              "This stream may feel challenging long-term."}
          </p>
        </>
      );
    })()}
  </div>
)}


      {/* ---------- STREAM PATH (SAFE MATCH) ---------- */}
      {selectedStream &&
        result.stream_paths &&
        (() => {
          const key = Object.keys(result.stream_paths).find(
            (k) => k.toLowerCase() === selectedStream.toLowerCase()
          );
          if (!key) return null;

          const path = result.stream_paths[key];

          return (
            <div className="card">
              <h3>{key} Career Path</h3>

              <div className="path-step">
                🎓 <b>Intermediate</b>
                <p>{path.intermediate}</p>
              </div>

              <div className="path-step">
                🏫 <b>Undergraduate</b>
                <p>{path.undergraduate}</p>
              </div>

              <div className="path-step">
                🎓 <b>Postgraduate</b>
                <p>{path.postgraduate}</p>
              </div>

              <div className="path-step">
                💼 <b>Job Opportunities</b>
                <ul>
                  {path.job_opportunities.map((job: string) => (
                    <li key={job}>• {job}</li>
                  ))}
                </ul>
              </div>

              <div className="path-step">
                🧑‍💻 <b>Day in the Life</b>
                <p>{result.scenario}</p>
              </div>
            </div>
          );
        })()}

      <h3>Nearby Opportunities</h3>
      <MapView />
    </div>
  );
}
