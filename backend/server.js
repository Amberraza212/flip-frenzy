import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import resultsRoute from "./routes/results.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Proper CORS setup (allow localhost + your deployed frontend)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev frontend
      "https://game-frontend-hazel.vercel.app", // main frontend domain
      "https://game-frontend-git-main-ambers-projects-2d8614a1.vercel.app", // branch/preview domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/leaderboard", resultsRoute);

// ✅ Test route (for checking deployment)
app.get("/", (req, res) => {
  res.send("🏁 Game Leaderboard API is running!");
});

// ✅ MongoDB connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
