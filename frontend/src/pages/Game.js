import React, { useState, useEffect } from "react";
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

  const playerName =
    location.state?.playerName?.trim() ||
    localStorage.getItem("playerName") ||
    "Player";

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [finalTime, setFinalTime] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5004";

  // shuffle / start game
  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((c) => ({ ...c, id: Math.random(), matched: false }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffled);
    setTurns(0);
    setGameOver(false);
    setTimeLeft(40);
    setFinalTime(0);
    setScoreSaved(false);
    setCelebrate(false);
  };

  useEffect(() => {
    if (location.state?.playerName) {
      localStorage.setItem("playerName", location.state.playerName);
    }
    shuffleCards();
  }, []);

  const handleChoice = (card) => {
    if (disabled) return;
    if (choiceOne && card.id === choiceOne.id) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prev) =>
          prev.map((c) =>
            c.src === choiceOne.src ? { ...c, matched: true } : c
          )
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

  useEffect(() => {
    if (!gameOver) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameOver(true);
        setFinalTime(40);
      }
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched)) {
      setGameOver(true);
      const elapsed = 40 - timeLeft;
      setFinalTime(elapsed);
      setCelebrate(true);
    }
  }, [cards]);

  // 🔇 Silent score save (no alert)
  const handleSaveScore = async () => {
    if (scoreSaved) return;
    try {
      const resultData = { name: playerName, turns, time: finalTime };
      await axios.post(`${BASE_URL}/api/leaderboard`, resultData);
      localStorage.setItem("lastGameResult", JSON.stringify(resultData));
      setScoreSaved(true);
    } catch (err) {
      console.error("❌ Error saving result:", err.response?.data || err.message);
    }
  };

  const renderConfetti = () => {
    if (!celebrate) return null;
    return Array.from({ length: 14 }).map((_, i) => (
      <span
        key={i}
        className="confetti"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 30}%`,
        }}
      />
    ));
  };

  const formatTime = (t) => {
    if (t === null || t === undefined) return "—";
    const m = Math.floor(t / 60);
    const s = t % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="game-container dark-theme">
      {renderConfetti()}

      <div className="game-header">
        <div className="header-left">
          <h2 className="title">Flip Frenzy</h2>
          <p className="welcome">
            Welcome, <span className="player-name">{playerName}</span>!
          </p>
        </div>

        <div className="header-right">
          <p className="turns">
            Turns: <strong>{turns}</strong>
          </p>
          <p className={`timer ${timeLeft <= 10 ? "danger" : ""}`}>
            ⏳ {timeLeft}s
          </p>
          <div className="controls">
            <button className="btn small" onClick={shuffleCards}>
              🔁 Restart
            </button>
            <button className="btn small exit" onClick={() => navigate("/")}>
              🚪 Exit
            </button>
            <button className="btn small" onClick={() => navigate("/leaderboard")}>
              🏆
            </button>
          </div>
        </div>
      </div>

      {!gameOver ? (
        <div className="card-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={
                card.matched ||
                card.id === choiceOne?.id ||
                card.id === choiceTwo?.id
              }
              disabled={disabled}
            />
          ))}
        </div>
      ) : (
        <div className="game-over">
          <h2>{cards.every((c) => c.matched) ? "🎉 You Won!" : "⏱ Time's Up"}</h2>
          {cards.every((c) => c.matched) ? (
            <p>
              Awesome <strong>{playerName}</strong> — finished in{" "}
              <strong>{turns}</strong> turns and{" "}
              <strong>{formatTime(finalTime)}</strong>!
            </p>
          ) : (
            <p>
              Good try, <strong>{playerName}</strong>. Final turns:{" "}
              <strong>{turns}</strong>. Time used:{" "}
              <strong>{formatTime(finalTime)}</strong>.
            </p>
          )}

          <div className="game-over-buttons">
            <button className="btn" onClick={shuffleCards}>
              🔁 Play Again
            </button>
            <button
              className="btn save-btn"
              onClick={handleSaveScore}
              disabled={scoreSaved}
            >
              💾 {scoreSaved ? "Saved!" : "Save Score"}
            </button>
            <button className="btn" onClick={() => navigate("/leaderboard")}>
              🏆 Leaderboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}