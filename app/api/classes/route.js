import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClassModel from "@/models/Class";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  await connectDB();
  const classes = await ClassModel.find({ ownerId: session.id }, { name: 1, students: 1 })
    .sort({ createdAt: 1 })
    .lean();
  return NextResponse.json({
    classes: classes.map((c) => ({
      id: String(c._id),
      name: c.name,
      studentCount: (c.students || []).length,
    })),
  });
}

export async function POST(req) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Sinf nomi kerak" }, { status: 400 });
  }
  const students = Array.isArray(body.students)
    ? body.students.map((s) => s.trim()).filter(Boolean)
    : [];

  const created = await ClassModel.create({
    ownerId: session.id,
    name,
    students,
    reasons: {},
    topic: "",
    lessonDate: "",
  });

  return NextResponse.json(
    { id: String(created._id), name: created.name, studentCount: students.length },
    { status: 201 }
  );
}
