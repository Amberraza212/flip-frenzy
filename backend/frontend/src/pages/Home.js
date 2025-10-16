import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");

  const startGame = () => {
    if (playerName.trim() !== "") {
      navigate("/game", { state: { playerName } });
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="home-container">
      <h1>🎮 Flip Frenzy</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="name-input"
      />
      <div className="home-buttons">
        <button onClick={startGame} className="btn">
          Start Game
        </button>
        <button onClick={() => navigate("/leaderboard")} className="btn secondary">
          View Leaderboard
        </button>
      </div>
    </div>
  );
}