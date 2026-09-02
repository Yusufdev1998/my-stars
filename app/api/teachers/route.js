import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import { getSession } from "@/lib/auth";

async function requireAdmin(req) {
  const session = await getSession(req);
  if (!session) return { error: NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 }) };
  if (session.role !== "admin") {
    return { error: NextResponse.json({ error: "Faqat admin uchun ruxsat etilgan" }, { status: 403 }) };
  }
  return { session };
}

export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  await connectDB();
  const teachers = await Teacher.find({}, { username: 1, role: 1, createdAt: 1 }).sort({ createdAt: 1 }).lean();
  return NextResponse.json({
    teachers: teachers.map((t) => ({
      id: String(t._id),
      username: t.username,
      role: t.role,
      createdAt: t.createdAt,
    })),
  });
}

export async function POST(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  await connectDB();
  const body = await req.json();
  const username = (body.username || "").trim().toLowerCase();
  const password = body.password || "";
  if (!username || password.length < 6) {
    return NextResponse.json(
      { error: "Login kiriting va parol kamida 6 belgidan iborat bo'lsin" },
      { status: 400 }
    );
  }

  const existing = await Teacher.findOne({ username });
  if (existing) {
    return NextResponse.json({ error: "Bu login band" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const teacher = await Teacher.create({ username, passwordHash, role: "teacher" });
  return NextResponse.json(
    { id: String(teacher._id), username: teacher.username, role: teacher.role },
    { status: 201 }
  );
}
