import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();

  // ✅ Use your deployed backend URL here
  const BASE_URL = "https://game-lemon-kappa-99.vercel.app";

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // ✅ Corrected endpoint
        const res = await fetch(`${BASE_URL}/api/results?limit=50`);
        const data = await res.json();
        setScores(data.results || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [BASE_URL]);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Game Leaderboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : scores.length === 0 ? (
        <p>No results found.</p>
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
              <tr key={score._id || index}>
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td>{score.turns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn" onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default Leaderboard;