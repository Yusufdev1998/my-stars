import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClassModel from "@/models/Class";
import HistoryModel from "@/models/History";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

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

  const history = await HistoryModel.find({ classId: id })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();

  return NextResponse.json({
    history: history.map((h) => ({
      id: String(h._id),
      date: h.date,
      topic: h.topic,
      top: (h.entries || []).slice(0, 3),
    })),
  });
}
