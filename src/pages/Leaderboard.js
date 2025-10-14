import React, { useEffect, useState } from "react";
import "./Leaderboard.css";

const BASE_URL = "https://game-lemon-kappa-99.vercel.app"; // ✅ Your backend deployed URL

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/leaderboard`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="leaderboard-container">
      <h1>🏆 Game Leaderboard</h1>
      {scores.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              <th>Turns</th>
            </tr>
          </thead>
          <tbody>
            {scores
              .sort((a, b) => a.turns - b.turns) // sort by turns ascending
              .map((score, index) => (
                <tr key={score._id}>
                  <td>{index + 1}</td>
                  <td>{score.name}</td> {/* ✅ match with backend field */}
                  <td>{score.turns}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <a href="/" className="back-btn">
        ⬅ Back to Home
      </a>
    </div>
  );
};

export default Leaderboard;
