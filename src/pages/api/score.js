import mongoose from "mongoose";

// MongoDB connection string (Atlas se copy karo)
const MONGO_URI = "mongodb+srv://Gameuser:Amberraza@game.n4fk34b.mongodb.net/Game?retryWrites=true&w=majority&appName=Game";

// Cached connection (taake har request par dobara connect na ho)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect function
async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Score Model
const ScoreSchema = new mongoose.Schema({
  name: String,
  turns: Number,
  date: { type: Date, default: Date.now },
});

const Score = mongoose.models.Score || mongoose.model("Score", ScoreSchema);

// API Handler
export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const scores = await Score.find().sort({ turns: 1 });
    return res.status(200).json(scores);
  }

  if (req.method === "POST") {
    const { name, turns } = req.body;
    if (!name || typeof turns !== "number") {
      return res.status(400).json({ error: "Invalid data" });
    }
    const newScore = new Score({ name, turns });
    await newScore.save();
    return res.status(201).json(newScore);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
