// src/pages/Leaderboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/scores");
        const data = await res.json();

        // ✅ sort lowest score first (turns kam = better)
        const sorted = data.sort((a, b) => a.score - b.score).slice(0, 5);
        setScores(sorted);
      } catch (err) {
        console.error("Error fetching scores:", err);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>

      {scores.length === 0 ? (
        <p className="empty-msg">No scores yet. Be the first!</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Turns</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={entry.id} className={index < 3 ? "topper" : ""}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="leaderboard-buttons">
        <button className="btn back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
        <button className="btn play-again-btn" onClick={() => navigate("/game")}>
          Play Again
        </button>
      </div>
    </div>
  );
}
