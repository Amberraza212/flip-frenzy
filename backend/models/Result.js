import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  time: {
    type: String, // or Number if you're saving seconds
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Result", resultSchema);
