import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    turns: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);