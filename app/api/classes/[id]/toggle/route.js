import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClassModel from "@/models/Class";
import { REASONS } from "@/lib/constants";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Noto'g'ri id" }, { status: 400 });
  }
  const { student, reasonId } = await req.json();
  if (!student || !reasonId || !REASONS.some((r) => r.id === reasonId)) {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  await connectDB();
  const cls = await ClassModel.findOne({ _id: id, ownerId: session.id });
  if (!cls) return NextResponse.json({ error: "Sinf topilmadi" }, { status: 404 });

  const reasons = cls.reasons ? { ...cls.reasons } : {};
  const current = reasons[student] || [];
  const has = current.includes(reasonId);
  const next = has ? current.filter((r) => r !== reasonId) : [...current, reasonId];
  reasons[student] = next;

  cls.reasons = reasons;
  cls.markModified("reasons");
  await cls.save();

  return NextResponse.json({
    reasons,
    celebrate: !has && next.length === REASONS.length ? student : null,
  });
}
