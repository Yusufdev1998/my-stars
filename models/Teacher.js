import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "teacher"], default: "teacher" },
  },
  { timestamps: true }
);

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
