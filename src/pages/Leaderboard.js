import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

// ✅ Your deployed backend URL
const BACKEND_URL = "https://game-backend-git-main-ambers-projects-2d8614a1.vercel.app";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/scores`)
      .then((res) => setScores(res.data))
      .catch((err) =>
        console.error("Error fetching scores:", err.response?.data || err.message)
      );
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>🏆 Leaderboard</h1>
      {scores.length === 0 ? (
        <p>No scores yet. Play a game to get started!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Turns</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.turns}</td>
                <td>{new Date(s.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}