"use client";

import { useState } from "react";
import { Sparkles, Plus, Users, Trash2, Crown, LogOut } from "lucide-react";
import { api } from "@/lib/api";

export default function ClassPicker({ classes, session, onSelect, onCreated, onDeleted, onLogout, onManageTeachers }) {
  const [showCreate, setShowCreate] = useState(classes.length === 0);
  const [name, setName] = useState("");
  const [studentsText, setStudentsText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Sinf nomini kiriting");
      return;
    }
    const students = studentsText
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    setBusy(true);
    try {
      const created = await api.createClass(trimmedName, students);
      setName("");
      setStudentsText("");
      setShowCreate(false);
      onCreated(created);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Bu sinfni va uning tarixini butunlay o'chirasizmi?")) return;
    try {
      await api.deleteClass(id);
      onDeleted(id);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full text-white flex items-center justify-center px-5 py-10"
      style={{
        fontFamily: "'Quicksand', sans-serif",
        background: "radial-gradient(ellipse at 50% -10%, #24296b 0%, #12153f 45%, #0a0c26 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {session && (
          <div className="flex items-center justify-between mb-4 text-xs" style={{ color: "#8A85C4" }}>
            <span>
              {session.username}
              {session.role === "admin" && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full" style={{ background: "#3a2f6b" }}>
                  admin
                </span>
              )}
            </span>
            <div className="flex items-center gap-3">
              {session.role === "admin" && (
                <button onClick={onManageTeachers} className="flex items-center gap-1">
                  <Crown size={13} /> O&apos;qituvchilar
                </button>
              )}
              <button onClick={onLogout} className="flex items-center gap-1">
                <LogOut size={13} /> Chiqish
              </button>
            </div>
          </div>
        )}
        <h1
          className="text-3xl font-bold flex items-center gap-2 mb-1 justify-center"
          style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}
        >
          <Sparkles size={28} strokeWidth={2.5} />
          Yulduzlar Osmoni
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: "#B8A9E8" }}>
          Sinfni tanlang yoki yangi sinf yarating
        </p>

        {classes.length > 0 && (
          <div className="flex flex-col gap-2 mb-5">
            {classes.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ background: "#151a44", border: "1px solid #2a2f6b" }}
              >
                <button
                  onClick={() => onSelect(c.id)}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  <Users size={16} color="#8A85C4" />
                  <span className="font-semibold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {c.name}
                  </span>
                  <span className="text-xs" style={{ color: "#8A85C4" }}>
                    {c.studentCount} o&apos;quvchi
                  </span>
                </button>
                <button onClick={() => remove(c.id)} className="p-1.5 rounded-full" style={{ color: "#8A85C4" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold"
            style={{ background: "#151a44", border: "1px dashed #3A3F6B", color: "#B8A9E8" }}
          >
            <Plus size={16} /> Yangi sinf yaratish
          </button>
        ) : (
          <div className="rounded-3xl p-5" style={{ background: "#151a44", border: "1px solid #2a2f6b" }}>
            <label className="block text-xs mb-1" style={{ color: "#8A85C4" }}>
              Sinf nomi
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="masalan: 3-A sinf"
              className="w-full rounded-xl px-3 py-2 mb-3 text-sm outline-none"
              style={{ background: "#0e1136", color: "#F5F3FF" }}
            />
            <label className="block text-xs mb-1" style={{ color: "#8A85C4" }}>
              O&apos;quvchilar (vergul yoki har birini yangi qatorga yozing)
            </label>
            <textarea
              value={studentsText}
              onChange={(e) => setStudentsText(e.target.value)}
              placeholder={"Ali\nVali\nMalika"}
              rows={5}
              className="w-full rounded-xl px-3 py-2 mb-3 text-sm outline-none resize-none"
              style={{ background: "#0e1136", color: "#F5F3FF" }}
            />
            {error && <p className="text-xs mb-2" style={{ color: "#FF9B9B" }}>{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={create}
                disabled={busy}
                className="flex-1 rounded-xl py-2 text-sm font-semibold"
                style={{ background: "#FFD873", color: "#12153f" }}
              >
                {busy ? "Yaratilmoqda..." : "Yaratish"}
              </button>
              {classes.length > 0 && (
                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl px-4 py-2 text-sm"
                  style={{ border: "1px solid #3A3F6B", color: "#B8A9E8" }}
                >
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
