import express from "express";
import Result from "../models/Result.js";

const router = express.Router();

// 📌 Save game result
router.post("/", async (req, res) => {
  try {
    const { name, turns, time } = req.body; // ✅ include time

    if (!name || turns === undefined) {
      return res.status(400).json({ error: "Name and turns are required" });
    }

    // ✅ Prevent duplicate exact results (same name, turns & time)
    const duplicate = await Result.findOne({ name, turns, time });
    if (duplicate) {
      return res
        .status(200)
        .json({ message: "Result already exists", duplicate });
    }

    // ✅ Save new result with time & timestamp
    const newResult = new Result({
      name,
      turns,
      time, // ✅ new field added
      createdAt: new Date(),
    });

    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error("❌ Error saving result:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get ALL results (sorted by lowest turns)
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ turns: 1 });
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Test route - insert dummy result
router.get("/test/add", async (req, res) => {
  try {
    const existingTest = await Result.findOne({ name: "Test Player", turns: 10 });
    if (existingTest) {
      return res
        .status(200)
        .json({ message: "Test player already exists", existingTest });
    }

    const dummy = new Result({
      name: "Test Player",
      turns: 10,
      time: 45, // ✅ example time
      createdAt: new Date(),
    });

    await dummy.save();
    res.json({ message: "Dummy result added!", dummy });
  } catch (err) {
    console.error("❌ Error adding test result:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;