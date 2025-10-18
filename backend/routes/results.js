import express from "express";
import Result from "../models/Result.js";

const router = express.Router();

// ✅ POST - Save player result (with time)
router.post("/", async (req, res) => {
  try {
    const { name, turns, time } = req.body; // ⏱️ now includes time
    if (!name || turns === undefined || time === undefined) {
      return res.status(400).json({ error: "Name, turns, and time are required." });
    }

    const result = new Result({ name, turns, time }); // ✅ save time
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Fetch leaderboard (sorted by turns ascending)
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ turns: 1, time: 1 }); // ✅ sort by turns, then time
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching results:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
