import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClassModel from "@/models/Class";
import HistoryModel from "@/models/History";
import { todayStr } from "@/lib/constants";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Noto'g'ri id" }, { status: 400 });
  }
  await connectDB();
  const cls = await ClassModel.findOne({ _id: id, ownerId: session.id });
  if (!cls) return NextResponse.json({ error: "Sinf topilmadi" }, { status: 404 });

  const reasons = cls.reasons || {};
  const entries = (cls.students || [])
    .map((name) => ({ name, count: (reasons[name] || []).length }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);

  let entry = null;
  if (entries.length > 0) {
    const doc = await HistoryModel.create({
      classId: cls._id,
      date: cls.lessonDate || todayStr(),
      topic: cls.topic?.trim() || "Mavzu kiritilmagan",
      entries,
    });
    entry = {
      id: String(doc._id),
      date: doc.date,
      topic: doc.topic,
      top: doc.entries.slice(0, 3),
    };

    // keep only the most recent 60 history entries per class
    const extra = await HistoryModel.find({ classId: cls._id })
      .sort({ createdAt: -1 })
      .skip(60)
      .select("_id");
    if (extra.length) {
      await HistoryModel.deleteMany({ _id: { $in: extra.map((e) => e._id) } });
    }
  }

  cls.reasons = {};
  cls.markModified("reasons");
  cls.topic = "";
  cls.lessonDate = todayStr();
  await cls.save();

  return NextResponse.json({
    entry,
    reasons: {},
    topic: "",
    lessonDate: cls.lessonDate,
  });
}
