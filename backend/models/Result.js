import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  turns: { type: Number, required: true },
  time: { type: Number, required: false }, // ✅ added time field (in seconds)
  createdAt: { type: Date, default: Date.now }, // optional timestamp
});

const Result = mongoose.model("Result", resultSchema);
export default Result;