import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClassModel from "@/models/Class";
import HistoryModel from "@/models/History";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

function currentMonth() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

export async function GET(req, { params }) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Noto'g'ri id" }, { status: 400 });
  }
  await connectDB();
  const cls = await ClassModel.findOne({ _id: id, ownerId: session.id }, { _id: 1 }).lean();
  if (!cls) return NextResponse.json({ error: "Sinf topilmadi" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const month = /^\d{4}-\d{2}$/.test(searchParams.get("month") || "")
    ? searchParams.get("month")
    : currentMonth();

  const lessons = await HistoryModel.find({
    classId: id,
    date: { $gte: `${month}-01`, $lte: `${month}-31` },
  })
    .sort({ date: 1 })
    .lean();

  const totals = new Map();
  for (const lesson of lessons) {
    for (const e of lesson.entries || []) {
      totals.set(e.name, (totals.get(e.name) || 0) + e.count);
    }
  }

  const ranked = Array.from(totals, ([name, total]) => ({ name, total })).sort(
    (a, b) => b.total - a.total
  );

  return NextResponse.json({
    month,
    lessonCount: lessons.length,
    ranked,
    bestThree: ranked.slice(0, 3),
  });
}
