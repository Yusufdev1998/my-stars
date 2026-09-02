import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true, index: true },
    date: { type: String, default: "" }, // YYYY-MM-DD
    topic: { type: String, default: "" },
    // every student's star count for this lesson (only those with count > 0)
    entries: [
      {
        name: String,
        count: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.History || mongoose.model("History", HistorySchema);
