import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Tizimga kirilmagan" }, { status: 401 });
  }
  return NextResponse.json({ id: session.id, username: session.username, role: session.role });
}
