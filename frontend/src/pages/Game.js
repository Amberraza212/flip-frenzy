import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import "./Game.css";

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

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5004";

  // Shuffle cards
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

  // Handle card choice
  const handleChoice = (card) => {
    if (!disabled) choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare two selected cards
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

  // Save result when game over
  const saveResult = useCallback(async () => {
    try {
      if (cards.length && cards.every((c) => c.matched)) {
        setGameOver(true);
        const resultData = { name: playerName, turns };
        await axios.post(`${BASE_URL}/api/leaderboard`, resultData);
      }
    } catch (err) {
      console.error("❌ Error saving result:", err.response?.data || err.message);
    }
  }, [cards, playerName, turns, BASE_URL]);

  useEffect(() => {
    saveResult();
  }, [saveResult]);

  // Start game on mount
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Flip Frenzy</h2>
        <p>Player: {playerName}</p>
        <p>Turns: {turns}</p>
        <div className="game-buttons">
          <button className="btn" onClick={shuffleCards}>
            New Game
          </button>
          <button className="btn exit-btn" onClick={() => navigate("/")}>
            Exit Game
          </button>
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