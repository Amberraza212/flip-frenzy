import express from "express";
import Result from "../models/Result.js";

const router = express.Router();

// 📌 Save game result
router.post("/", async (req, res) => {
  try {
    const { name, turns } = req.body;
    if (!name || turns === undefined) {
      return res.status(400).json({ error: "Name and turns are required" });
    }

    // ✅ Prevent duplicate exact results
    const duplicate = await Result.findOne({ name, turns });
    if (duplicate) {
      return res.status(200).json({ message: "Result already exists", duplicate });
    }

    const newResult = new Result({ name, turns });
    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get top 10 results, sorted by lowest turns
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ turns: 1 }).limit(10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Test route - insert dummy result
router.get("/test/add", async (req, res) => {
  try {
    // Prevent duplicate test entries
    const existingTest = await Result.findOne({ name: "Test Player", turns: 10 });
    if (existingTest) {
      return res.status(200).json({ message: "Test player already exists", existingTest });
    }

    const dummy = new Result({ name: "Test Player", turns: 10 });
    await dummy.save();
    res.json({ message: "Dummy result added!", dummy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
