"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Crown } from "lucide-react";
import { api } from "@/lib/api";

export default function SetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const status = await api.setupStatus();
        if (!status.needed) {
          router.replace("/login");
          return;
        }
      } catch {
        // ignore — allow the form to show; POST will fail with a clear error if setup is done
      }
      setChecking(false);
    })();
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Parollar bir xil emas");
      return;
    }
    setBusy(true);
    try {
      await api.setupAdmin(username.trim().toLowerCase(), password);
      router.push("/");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (checking) return null;

  return (
    <div
      className="min-h-screen w-full text-white flex items-center justify-center px-5 py-10"
      style={{
        fontFamily: "'Quicksand', sans-serif",
        background: "radial-gradient(ellipse at 50% -10%, #24296b 0%, #12153f 45%, #0a0c26 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <h1
          className="text-3xl font-bold flex items-center gap-2 mb-1 justify-center"
          style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}
        >
          <Sparkles size={28} strokeWidth={2.5} />
          Yulduzlar Osmoni
        </h1>
        <p className="text-sm text-center mb-6 flex items-center justify-center gap-1.5" style={{ color: "#B8A9E8" }}>
          <Crown size={14} /> Birinchi sozlash — admin hisobini yarating
        </p>

        <form
          onSubmit={submit}
          className="rounded-3xl p-5 flex flex-col gap-3"
          style={{ background: "#151a44", border: "1px solid #2a2f6b" }}
        >
          <div>
            <label className="block text-xs mb-1" style={{ color: "#8A85C4" }}>
              Login
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: "#0e1136", color: "#F5F3FF" }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "#8A85C4" }}>
              Parol (kamida 6 belgi)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: "#0e1136", color: "#F5F3FF" }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "#8A85C4" }}>
              Parolni tasdiqlang
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: "#0e1136", color: "#F5F3FF" }}
            />
          </div>
          {error && <p className="text-xs" style={{ color: "#FF9B9B" }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl py-2.5 text-sm font-semibold mt-1"
            style={{ background: "#FFD873", color: "#12153f" }}
          >
            {busy ? "Yaratilmoqda..." : "Admin sifatida boshlash"}
          </button>
        </form>
      </div>
    </div>
  );
}
