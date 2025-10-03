import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import "./Game.css";

// ✅ Your deployed backend URL
const BACKEND_URL = "https://game-backend-git-main-ambers-projects-2d8614a1.vercel.app";

const cardImages = [
  { src: process.env.PUBLIC_URL + "/img/helmet.png", matched: false },
  { src: process.env.PUBLIC_URL + "/img/potion.png", matched: false },
  { src: process.env.PUBLIC_URL + "/img/ring.png", matched: false },
  { src: process.env.PUBLIC_URL + "/img/scroll.png", matched: false },
  { src: process.env.PUBLIC_URL + "/img/shield.png", matched: false },
  { src: process.env.PUBLIC_URL + "/img/sword.png", matched: false },
];

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const playerName = location.state?.playerName?.trim() || "Player";

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((c) => ({ ...c, id: Math.random() }));
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffled);
    setTurns(0);
    setGameOver(false);
  };

  const handleChoice = (card) => {
    if (!disabled) choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prev) =>
          prev.map((c) => (c.src === choiceOne.src ? { ...c, matched: true } : c))
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 900);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);
  };

  // ✅ Save score when game finishes
  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched)) {
      setGameOver(true);

      const scoreData = {
        name: playerName || "Player",
        turns: Number(turns),
      };

      axios
        .post(`${BACKEND_URL}/api/scores`, scoreData)
        .then(() => console.log("Score saved ✅"))
        .catch((err) =>
          console.error("Error saving score:", err.response?.data || err.message)
        );
    }
  }, [cards, playerName, turns]);

  useEffect(() => shuffleCards(), []);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Flip Frenzy</h2>
        <p>Player: {playerName}</p>
        <p>Turns: {turns}</p>
        <div className="game-buttons">
          <button onClick={shuffleCards} className="btn">New Game</button>
          <button onClick={() => navigate("/")} className="btn exit-btn">Exit Game</button>
        </div>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card.matched || card.id === choiceOne?.id || card.id === choiceTwo?.id}
            disabled={disabled}
          />
        ))}
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>🎉 Congratulations {playerName}!</h2>
          <p>You finished in {turns} turns.</p>
          <button className="btn" onClick={() => navigate("/leaderboard")}>
            View Leaderboard
          </button>
        </div>
      )}
    </div>
  );
}