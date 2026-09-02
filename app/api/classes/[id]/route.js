import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClassModel from "@/models/Class";
import HistoryModel from "@/models/History";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(req, { params }) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Noto'g'ri id" }, { status: 400 });
  await connectDB();
  const cls = await ClassModel.findOne({ _id: id, ownerId: session.id }).lean();
  if (!cls) return NextResponse.json({ error: "Sinf topilmadi" }, { status: 404 });
  return NextResponse.json({
    id: String(cls._id),
    name: cls.name,
    students: cls.students || [],
    reasons: cls.reasons || {},
    topic: cls.topic || "",
    lessonDate: cls.lessonDate || "",
  });
}

export async function PATCH(req, { params }) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Noto'g'ri id" }, { status: 400 });
  await connectDB();
  const body = await req.json();
  const update = {};
  if (typeof body.topic === "string") update.topic = body.topic;
  if (typeof body.lessonDate === "string") update.lessonDate = body.lessonDate;
  if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();
  if (Array.isArray(body.students)) {
    update.students = body.students.map((s) => String(s).trim()).filter(Boolean);
  }

  const cls = await ClassModel.findOneAndUpdate(
    { _id: id, ownerId: session.id },
    update,
    { new: true }
  ).lean();
  if (!cls) return NextResponse.json({ error: "Sinf topilmadi" }, { status: 404 });
  return NextResponse.json({
    id: String(cls._id),
    name: cls.name,
    students: cls.students || [],
    reasons: cls.reasons || {},
    topic: cls.topic || "",
    lessonDate: cls.lessonDate || "",
  });
}

export async function DELETE(req, { params }) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Noto'g'ri id" }, { status: 400 });
  await connectDB();
  const cls = await ClassModel.findOneAndDelete({ _id: id, ownerId: session.id });
  if (!cls) return NextResponse.json({ error: "Sinf topilmadi" }, { status: 404 });
  await HistoryModel.deleteMany({ classId: id });
  return NextResponse.json({ ok: true });
}
