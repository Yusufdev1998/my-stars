"use client";

import { useState, useEffect } from "react";
import { X, Crown, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

export default function TeacherAdmin({ onClose }) {
  const [teachers, setTeachers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await api.listTeachers();
      setTeachers(res.teachers);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.createTeacher(username.trim().toLowerCase(), password);
      setUsername("");
      setPassword("");
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(6,7,26,0.72)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl p-5 riseIn"
        style={{ background: "#12153f", border: "1px solid #2a2f6b" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}>
            <Crown size={18} /> O&apos;qituvchilar
          </h2>
          <button onClick={onClose} className="p-1 rounded-full" style={{ color: "#8A85C4" }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          {teachers.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "#1b2050" }}>
              <span className="text-sm">{t.username}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: t.role === "admin" ? "#3a2f6b" : "#20244f", color: "#B8A9E8" }}
              >
                {t.role === "admin" ? "admin" : "o'qituvchi"}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={create} className="rounded-2xl p-3 flex flex-col gap-2" style={{ background: "#151a44", border: "1px solid #2a2f6b" }}>
          <p className="text-xs" style={{ color: "#8A85C4" }}>
            Yangi o&apos;qituvchi qo&apos;shish
          </p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Login"
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ background: "#0e1136", color: "#F5F3FF" }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol (kamida 6 belgi)"
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ background: "#0e1136", color: "#F5F3FF" }}
          />
          {error && <p className="text-xs" style={{ color: "#FF9B9B" }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold"
            style={{ background: "#FFD873", color: "#12153f" }}
          >
            <UserPlus size={16} />
            {busy ? "Qo'shilmoqda..." : "Qo'shish"}
          </button>
        </form>
      </div>
    </div>
  );
}
