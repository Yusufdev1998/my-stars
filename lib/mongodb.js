import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see README.md)."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
