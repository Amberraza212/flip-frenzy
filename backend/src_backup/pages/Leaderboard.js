import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();

  // ✅ Correct backend API base URL (your backend on Vercel)
  const BASE_URL = "https://game-lemon-kappa-99.vercel.app";

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError("");
        console.log("📡 Fetching leaderboard from:", `${BASE_URL}/api/leaderboard`);

        const response = await fetch(`${BASE_URL}/api/leaderboard`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // ⚠️ Check for valid response
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        // 🧾 Parse JSON safely
        const data = await response.json();
        console.log("✅ Leaderboard data fetched successfully:", data);

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
        <p>Loading leaderboard...</p>
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
            {scores.map((player, index) => (
              <tr key={player._id || index}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.turns}</td>
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