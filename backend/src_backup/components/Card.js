import React from "react";
import "./Card.css";

export default function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled && !card.matched) {
      handleChoice(card);
    }
  };

  return (
    <div className="card-container">
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        {/* Front side */}
        <div className="card-front">
          <img src={card.src} alt="card front" />
        </div>
        {/* Back side */}
        <div className="card-back" onClick={handleClick}></div>
      </div>
    </div>
  );
}
