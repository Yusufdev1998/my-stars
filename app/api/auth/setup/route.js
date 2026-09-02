import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import { signSession, attachSessionCookie } from "@/lib/auth";

// GET: tells the frontend whether first-run setup (creating the admin) is still needed.
export async function GET() {
  await connectDB();
  const count = await Teacher.countDocuments();
  return NextResponse.json({ needed: count === 0 });
}

// POST: creates the first admin account. Only allowed while no teachers exist yet.
export async function POST(req) {
  await connectDB();
  const count = await Teacher.countDocuments();
  if (count > 0) {
    return NextResponse.json({ error: "Sozlash allaqachon bajarilgan" }, { status: 409 });
  }

  const body = await req.json();
  const username = (body.username || "").trim().toLowerCase();
  const password = body.password || "";
  if (!username || password.length < 6) {
    return NextResponse.json(
      { error: "Login kiriting va parol kamida 6 belgidan iborat bo'lsin" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Teacher.create({ username, passwordHash, role: "admin" });

  const token = await signSession({ id: admin._id, username: admin.username, role: admin.role });
  const res = NextResponse.json({ id: String(admin._id), username: admin.username, role: admin.role });
  return attachSessionCookie(res, token);
}
