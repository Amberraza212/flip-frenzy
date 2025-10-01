import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory scores array
let scores = [];

// ✅ POST /api/scores → add new score
app.post("/api/scores", (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }

  const newScore = { id: Date.now().toString(), name, score };
  scores.push(newScore);

  res.status(201).json(newScore);
});

// ✅ GET /api/scores → fetch all scores
app.get("/api/scores", (req, res) => {
  res.json(scores);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});