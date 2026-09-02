import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import { signSession, attachSessionCookie } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const username = (body.username || "").trim().toLowerCase();
  const password = body.password || "";

  const teacher = username ? await Teacher.findOne({ username }) : null;
  const ok = teacher && (await bcrypt.compare(password, teacher.passwordHash));
  if (!ok) {
    return NextResponse.json({ error: "Login yoki parol xato" }, { status: 401 });
  }

  const token = await signSession({ id: teacher._id, username: teacher.username, role: teacher.role });
  const res = NextResponse.json({ id: String(teacher._id), username: teacher.username, role: teacher.role });
  return attachSessionCookie(res, token);
}
