import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5004";

  // ✅ Memoized fetchLeaderboard to avoid ESLint warning
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/leaderboard`);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      const data = await res.json();
      setScores(data);
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="leaderboard-container">
      <h1>🏆 Leaderboard</h1>

      {scores.length === 0 ? (
        <p>No results yet. Play the game to see your score!</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Turns</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score._id}>
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td>{score.turns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="back-btn" onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default Leaderboard;