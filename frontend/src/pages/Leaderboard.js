import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();

  // ✅ Backend URL (local for now)
  const BASE_URL = "https://flip-frenzy-lime.vercel.app/";

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError("");
        setLoading(true);

        const response = await fetch(`${BASE_URL}/api/leaderboard`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();
        setScores(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // 🔍 Filter players by name
  const filteredScores = scores.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="leaderboard-container">
      {/* 🟡 Back Button ABOVE the title */}
      <button className="back-button" onClick={() => navigate("/")}>
  ⬅ Back to Home
</button>


<h2 className="leaderboard-title">🏆 Game Leaderboard</h2>

      <input
        type="text"
        placeholder="Search player by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading Leaderboard...</p>
        </div>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredScores.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Turns</th>
              <th>Time Taken (sec)</th>
            </tr>
          </thead>
          <tbody>
            {filteredScores.map((player, index) => (
              <tr key={player._id || index}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.turns}</td>
                <td>{player.time || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;