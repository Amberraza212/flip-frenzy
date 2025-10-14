import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();
  const BASE_URL = "https://game-lemon-kappa-99.vercel.app"; // ✅ Backend URL

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BASE_URL}/api/leaderboard`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Leaderboard Data:", data);

        setScores(data || []);
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Game Leaderboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
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