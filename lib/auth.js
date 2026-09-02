import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "yulduzlar_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Add it to .env.local (see README.md).");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession({ id, username, role }) {
  return await new SignJWT({ username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { id: payload.sub, username: payload.username, role: payload.role };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

// Reads + verifies the session cookie from a Next.js Request object (App Router route handlers).
export async function getSession(req) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

// Sets the session cookie on a NextResponse.
export function attachSessionCookie(res, token) {
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}

// Clears the session cookie on a NextResponse.
export function clearSessionCookie(res) {
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
