import axios from "axios";

// Example function jab game finish ho
const saveScore = async (playerName, playerScore) => {
  try {
    await axios.post("http://localhost:5000/api/scores", {
      name: playerName,
      score: playerScore,
    });
    alert("Score saved to backend!");
  } catch (error) {
    console.error("Error saving score:", error);
  }
};