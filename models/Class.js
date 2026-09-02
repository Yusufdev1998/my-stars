import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true, index: true },
    name: { type: String, required: true, trim: true },
    students: { type: [String], default: [] },
    // studentName -> array of earned reason ids for the current (unfinished) lesson
    reasons: { type: mongoose.Schema.Types.Mixed, default: {} },
    topic: { type: String, default: "" },
    lessonDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
