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
  const playerName = location.state?.playerName?.trim() || "Player";

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
<<<<<<< HEAD:src_backup/pages/Game.js
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5004";
=======

  // ✅ Backend URL
  const BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "https://game-lemon-kappa-99.vercel.app";
>>>>>>> 0b68f6a515a1ad34e312aaa579ff0ca43aab85f6:backend/src_backup/pages/Game.js

  // 🎴 Shuffle cards
  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((c) => ({ ...c, id: Math.random() }));
<<<<<<< HEAD:src_backup/pages/Game.js

=======
>>>>>>> 0b68f6a515a1ad34e312aaa579ff0ca43aab85f6:backend/src_backup/pages/Game.js
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffled);
    setTurns(0);
    setGameOver(false);
<<<<<<< HEAD:src_backup/pages/Game.js
    setTimeLeft(40);
    setScoreSaved(false);
    setCelebrate(false);
  };

  // 🎯 Handle choice
=======
  };

  // 🎯 Handle card choice
>>>>>>> 0b68f6a515a1ad34e312aaa579ff0ca43aab85f6:backend/src_backup/pages/Game.js
  const handleChoice = (card) => {
    if (!disabled) choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

<<<<<<< HEAD:src_backup/pages/Game.js
  // 🔄 Compare cards
=======
  // 🔄 Compare two selected cards
>>>>>>> 0b68f6a515a1ad34e312aaa579ff0ca43aab85f6:backend/src_backup/pages/Game.js
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

<<<<<<< HEAD:src_backup/pages/Game.js
  // ✅ Timer countdown + progress bar
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      setFinalTime(40);
    }
  }, [timeLeft, gameStarted, gameOver]);

  // ✅ Check for game complete
  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched)) {
      setGameOver(true);
      setFinalTime(40 - timeLeft);
      setCelebrate(true);
    }
  }, [cards]);

  // 💾 Save score
  const handleSaveScore = async () => {
    if (scoreSaved) return;
    setIsLoading(true);
    try {
      const resultData = { name: playerName, turns, time: finalTime };
      await axios.post(`${BASE_URL}/api/leaderboard`, resultData);
      localStorage.setItem("lastGameResult", JSON.stringify(resultData));
      setScoreSaved(true);
      alert("✅ Score saved to leaderboard!");
    } catch (err) {
      console.error("❌ Error saving result:", err.response?.data || err.message);
      alert("❌ Failed to save score.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    shuffleCards();
  };

  // 🌀 Progress bar fill percentage
  const progressPercent = ((40 - timeLeft) / 40) * 100;

  // 🎉 Confetti animation
  const renderConfetti = () => {
    if (!celebrate) return null;
    return Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="confetti"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: i % 2 ? "#ffd700" : "#fff",
          animationDelay: `${Math.random()}s`,
        }}
      ></div>
    ));
  };

  return (
    <div className="game-container">
      {renderConfetti()}

      {/* 🏁 Start Overlay */}
      {!gameStarted && !gameOver && (
        <div className="start-overlay">
          <h2>🎮 Welcome, {playerName}!</h2>
          <p>Are you ready to test your memory?</p>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}

      {/* 🌀 Loading Spinner */}
      {isLoading && <div className="loading-spinner"></div>}

      {/* Main Game Section */}
      {gameStarted && !gameOver && (
        <>
          <div className="game-header">
            <h2>Flip Frenzy</h2>
            <p>Player: {playerName}</p>
            <p>Turns: {turns}</p>
            <p className={`timer ${timeLeft <= 10 ? "danger" : ""}`}>
              Time Left: {timeLeft}s
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="game-buttons">
              <button className="btn" onClick={shuffleCards}>
                🔁 Restart
              </button>
              <button className="btn exit-btn" onClick={() => navigate("/")}>
                🚪 Exit
              </button>
            </div>
          </div>

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
        </>
      )}

      {/* 🎮 Game Over Screen */}
      {gameOver && (
        <div className="game-over">
          <h2>🎮 Game Over!</h2>
          {cards.every((c) => c.matched) ? (
            <p>
              🎉 Awesome {playerName}! You finished in {turns} turns and{" "}
              {finalTime}s!
            </p>
          ) : (
            <p>⏱ Time’s up, {playerName}! Try again soon!</p>
          )}

          <div className="game-over-buttons">
            <button className="btn" onClick={shuffleCards}>
              🔁 Play Again
            </button>
            <button
              className="btn save-btn"
              onClick={handleSaveScore}
              disabled={scoreSaved || isLoading}
            >
              💾 {scoreSaved ? "Saved!" : "Save Score"}
            </button>
            <button className="btn" onClick={() => navigate("/leaderboard")}>
              🏆 Leaderboard
            </button>
          </div>
=======
  // ✅ Game complete check
  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched)) {
      setGameOver(true);
    }
  }, [cards]);

  // ✅ Save result when gameOver becomes true
  useEffect(() => {
    const saveResult = async () => {
      if (!gameOver) return;
      try {
        const resultData = { name: playerName, turns };
        await axios.post(`${BASE_URL}/api/leaderboard`, resultData);
        console.log("✅ Result saved:", resultData);
      } catch (err) {
        console.error("❌ Error saving result:", err.response?.data || err.message);
      }
    };

    saveResult();
  }, [gameOver, playerName, turns, BASE_URL]);

  // 🎮 Start game on mount
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
            flipped={
              card.matched ||
              card.id === choiceOne?.id ||
              card.id === choiceTwo?.id
            }
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
>>>>>>> 0b68f6a515a1ad34e312aaa579ff0ca43aab85f6:backend/src_backup/pages/Game.js
        </div>
      )}
    </div>
  );
}