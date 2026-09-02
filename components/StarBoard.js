"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Star,
  X,
  RotateCcw,
  Sparkles,
  Crown,
  Check,
  History,
  CalendarDays,
  BookOpen,
  Users2,
  ArrowLeft,
  Plus,
  Trophy,
} from "lucide-react";
import { REASONS, levelColor, fmtDate, todayStr } from "@/lib/constants";
import { api } from "@/lib/api";
import MonthlyReport from "@/components/MonthlyReport";

export default function StarBoard({ classId, className, onSwitchClass }) {
  const [students, setStudents] = useState([]);
  const [reasons, setReasons] = useState({});
  const [topic, setTopic] = useState("");
  const [lessonDate, setLessonDate] = useState(todayStr());
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [openStudent, setOpenStudent] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [newStudent, setNewStudent] = useState("");
  const [celebrate, setCelebrate] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoaded(false);
    try {
      const cls = await api.getClass(classId);
      setStudents(cls.students || []);
      setReasons(cls.reasons || {});
      setTopic(cls.topic || "");
      setLessonDate(cls.lessonDate || todayStr());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoaded(true);
    }
  }, [classId]);

  useEffect(() => {
    // Fetch-on-mount pattern: `load` sets state asynchronously after its
    // await, which this lint rule can't distinguish from a synchronous call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Debounced save of topic / lessonDate
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      api.updateClass(classId, { topic, lessonDate }).catch((e) => setError(e.message));
    }, 500);
    return () => clearTimeout(t);
  }, [topic, lessonDate, loaded, classId]);

  const toggleReason = async (name, reasonId) => {
    // optimistic update
    setReasons((d) => {
      const current = d[name] || [];
      const has = current.includes(reasonId);
      const next = has ? current.filter((r) => r !== reasonId) : [...current, reasonId];
      return { ...d, [name]: next };
    });
    try {
      const res = await api.toggleReason(classId, name, reasonId);
      setReasons(res.reasons);
      if (res.celebrate) {
        setCelebrate(res.celebrate);
        setTimeout(() => setCelebrate(null), 1400);
      }
    } catch (e) {
      setError(e.message);
      load();
    }
  };

  const ranked = useMemo(
    () =>
      students
        .map((name) => ({ name, count: (reasons[name] || []).length }))
        .sort((a, b) => b.count - a.count),
    [students, reasons]
  );
  const top = ranked.filter((r) => r.count > 0).slice(0, 6);

  const finishLesson = async () => {
    try {
      const res = await api.finishLesson(classId);
      setReasons(res.reasons);
      setTopic(res.topic);
      setLessonDate(res.lessonDate);
      setOpenStudent(null);
      if (res.entry) {
        setHistory((h) => [res.entry, ...h].slice(0, 60));
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const openHistory = async () => {
    setShowHistory(true);
    try {
      const res = await api.getHistory(classId);
      setHistory(res.history);
    } catch (e) {
      setError(e.message);
    }
  };

  const addStudent = async () => {
    const name = newStudent.trim();
    if (!name || students.includes(name)) return;
    const next = [...students, name];
    setStudents(next);
    setNewStudent("");
    try {
      await api.updateClass(classId, { students: next });
    } catch (e) {
      setError(e.message);
    }
  };

  const removeStudent = async (name) => {
    const next = students.filter((s) => s !== name);
    setStudents(next);
    try {
      await api.updateClass(classId, { students: next });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full text-white relative"
      style={{
        fontFamily: "'Quicksand', sans-serif",
        background: "radial-gradient(ellipse at 50% -10%, #24296b 0%, #12153f 45%, #0a0c26 100%)",
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 45 }).map((_, i) => {
          const size = ((i * 37) % 100) / 50 + 1;
          return (
            <span
              key={i}
              className="bgdot"
              style={{
                width: size,
                height: size,
                top: `${(i * 53) % 100}%`,
                left: `${(i * 29) % 100}%`,
                animationDelay: `${(i % 30) / 10}s`,
              }}
            />
          );
        })}
      </div>

      {celebrate && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-start justify-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="confetti"
              style={{
                left: `${45 + ((i * 7) % 10)}%`,
                top: `${18 + ((i * 11) % 10)}%`,
                animationDelay: `${(i % 3) * 0.1}s`,
              }}
            >
              {["⭐", "✨", "🎉"][i % 3]}
            </span>
          ))}
          <div className="mt-24 px-5 py-3 rounded-2xl riseIn" style={{ background: "#12153f", border: "1px solid #FFD873" }}>
            <p className="font-bold text-center" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}>
              🎉 {celebrate} 5 ta yulduzga yetdi!
            </p>
          </div>
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-start justify-between mb-5 gap-3">
          <div>
            <button
              onClick={onSwitchClass}
              className="flex items-center gap-1 text-xs mb-1"
              style={{ color: "#8A85C4" }}
            >
              <ArrowLeft size={12} /> Sinflar
            </button>
            <h1
              className="text-3xl sm:text-4xl font-bold flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}
            >
              <Sparkles size={30} strokeWidth={2.5} />
              {className}
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: "#B8A9E8" }}>
              Bosing — sabab tanlang — yulduz yonadi ✨
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <button
              onClick={() => setShowRoster(true)}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-full border"
              style={{ borderColor: "#3A3F6B", color: "#B8A9E8" }}
            >
              <Users2 size={14} />
              Ro&apos;yxat
            </button>
            <button
              onClick={openHistory}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-full border"
              style={{ borderColor: "#3A3F6B", color: "#B8A9E8" }}
            >
              <History size={14} />
              Tarix
            </button>
            <button
              onClick={() => setShowMonthly(true)}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-full border"
              style={{ borderColor: "#3A3F6B", color: "#B8A9E8" }}
            >
              <Trophy size={14} />
              Oylik hisobot
            </button>
            <button
              onClick={finishLesson}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-full border"
              style={{ borderColor: "#3A3F6B", color: "#B8A9E8" }}
            >
              <RotateCcw size={14} />
              Darsni yakunlash
            </button>
          </div>
        </div>

        {error && (
          <div
            className="rounded-xl px-3 py-2 mb-4 text-xs"
            style={{ background: "#2a1330", border: "1px solid #5b2a3a", color: "#FF9B9B" }}
          >
            {error}
          </div>
        )}

        {/* Lesson info card */}
        <div
          className="rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
          style={{ background: "#151a44", border: "1px solid #2a2f6b" }}
        >
          <label className="flex items-center gap-2 flex-1 rounded-xl px-3 py-2" style={{ background: "#0e1136" }}>
            <CalendarDays size={16} color="#8A85C4" />
            <input
              type="date"
              value={lessonDate}
              onChange={(e) => setLessonDate(e.target.value)}
              className="bg-transparent text-sm w-full outline-none"
              style={{ color: "#F5F3FF", colorScheme: "dark" }}
            />
          </label>
          <label className="flex items-center gap-2 flex-[2] rounded-xl px-3 py-2" style={{ background: "#0e1136" }}>
            <BookOpen size={16} color="#8A85C4" className="shrink-0" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Dars mavzusi — masalan: Sonlar va raqamlar"
              className="bg-transparent text-sm w-full outline-none placeholder:opacity-60"
              style={{ color: "#F5F3FF" }}
            />
          </label>
        </div>

        {/* Top sky */}
        <div className="rounded-3xl p-6 mb-8" style={{ background: "linear-gradient(180deg, #171b4d 0%, #0e1136 100%)" }}>
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8A85C4" }}>
            Bugungi eng yorqin yulduzlar
          </p>
          {top.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: "#5B5F91" }}>
              Osmon hali sokin — birinchi yulduzni yoqing ✨
            </p>
          ) : (
            <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-5 py-4">
              {top.map((r, i) => (
                <button key={r.name} onClick={() => setOpenStudent(r.name)} className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <Star
                      fill={levelColor(r.count)}
                      color={levelColor(r.count)}
                      size={i === 0 ? 34 + r.count * 2 : 22 + r.count * 2}
                      style={{ filter: `drop-shadow(0 0 ${6 + r.count * 2}px ${levelColor(r.count)}aa)` }}
                    />
                    {i === 0 && <Crown size={16} className="absolute -top-3 -right-2" color="#FFD873" fill="#FFD873" />}
                  </div>
                  <span className="text-sm font-semibold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {r.name}
                  </span>
                  <span className="text-xs" style={{ color: "#8A85C4" }}>
                    {r.count}/5
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#8A85C4" }}>
          Sinf osmoni — bosing va sabab tanlang
        </p>
        {students.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: "#5B5F91" }}>
            Bu sinfda hali o&apos;quvchi yo&apos;q. &quot;Ro&apos;yxat&quot; tugmasi orqali qo&apos;shing.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {students.map((name) => {
              const rs = reasons[name] || [];
              const count = rs.length;
              return (
                <button
                  key={name}
                  onClick={() => setOpenStudent(name)}
                  className="flex flex-col items-center gap-2 rounded-2xl py-4 px-2 transition-transform active:scale-95"
                  style={{ background: "#151a44", border: `1px solid ${count > 0 ? "#3A3F6B" : "#20244f"}` }}
                >
                  <Star
                    fill={count === 0 ? "#3A3F6B" : levelColor(count)}
                    color={count === 0 ? "#3A3F6B" : levelColor(count)}
                    size={20 + count * 2.5}
                    style={{ filter: count > 0 ? `drop-shadow(0 0 6px ${levelColor(count)}77)` : "none" }}
                  />
                  <span className="text-xs font-semibold text-center leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {name}
                  </span>
                  <div className="flex items-end gap-0.5 h-3">
                    {REASONS.map((r, i) => (
                      <span
                        key={r.id}
                        className="rounded-sm"
                        style={{
                          width: 4,
                          height: 3 + i * 2,
                          background: rs.includes(r.id) ? levelColor(i + 1) : "#2b2f63",
                        }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-xs text-center mt-8 pb-4" style={{ color: "#5B5F91" }}>
          Har sababdan bittadan — bir darsda maksimal 5 ta yulduz.
        </p>
      </div>

      {/* Reason picker modal */}
      {openStudent && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(6,7,26,0.72)" }}
          onClick={() => setOpenStudent(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-5 riseIn"
            style={{ background: "#12153f", border: "1px solid #2a2f6b" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}>
                {openStudent}
              </h2>
              <button onClick={() => setOpenStudent(null)} className="p-1 rounded-full" style={{ color: "#8A85C4" }}>
                <X size={20} />
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: "#8A85C4" }}>
              {(reasons[openStudent] || []).length}/5 yulduz — sabab tanlang
            </p>
            <div className="flex flex-col gap-2">
              {REASONS.map((r, i) => {
                const earned = (reasons[openStudent] || []).includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => toggleReason(openStudent, r.id)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${earned ? "pop" : ""}`}
                    style={{
                      background: earned ? `${levelColor(i + 1)}22` : "#1b2050",
                      border: `1px solid ${earned ? levelColor(i + 1) : "#2a2f6b"}`,
                    }}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                        {r.label}
                      </span>
                      <span className="block text-xs" style={{ color: "#8A85C4" }}>
                        {r.desc}
                      </span>
                    </span>
                    {earned && (
                      <span className="rounded-full p-1" style={{ background: levelColor(i + 1) }}>
                        <Check size={14} color="#12153f" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(6,7,26,0.72)" }}
          onClick={() => setShowHistory(false)}
        >
          <div
            className="w-full max-w-sm max-h-[80vh] overflow-y-auto rounded-3xl p-5 riseIn"
            style={{ background: "#12153f", border: "1px solid #2a2f6b" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}>
                <History size={18} /> Darslar tarixi
              </h2>
              <button onClick={() => setShowHistory(false)} className="p-1 rounded-full" style={{ color: "#8A85C4" }}>
                <X size={20} />
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-sm py-6 text-center" style={{ color: "#5B5F91" }}>
                Hali dars yakunlanmagan. &quot;Darsni yakunlash&quot; bosilganda shu yerda saqlanadi.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map((h) => (
                  <div key={h.id} className="rounded-xl p-3" style={{ background: "#1b2050", border: "1px solid #2a2f6b" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: "#B8A9E8" }}>
                        {fmtDate(h.date)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1.5" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {h.topic}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {h.top.map((t, i) => (
                        <span
                          key={t.name}
                          className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          style={{ background: "#0e1136", color: "#D9D4F5" }}
                        >
                          {i === 0 ? "👑" : "⭐"} {t.name} ({t.count})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Roster management panel */}
      {showRoster && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(6,7,26,0.72)" }}
          onClick={() => setShowRoster(false)}
        >
          <div
            className="w-full max-w-sm max-h-[80vh] overflow-y-auto rounded-3xl p-5 riseIn"
            style={{ background: "#12153f", border: "1px solid #2a2f6b" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}>
                <Users2 size={18} /> O&apos;quvchilar ro&apos;yxati
              </h2>
              <button onClick={() => setShowRoster(false)} className="p-1 rounded-full" style={{ color: "#8A85C4" }}>
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addStudent()}
                placeholder="Yangi o'quvchi ismi"
                className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: "#0e1136", color: "#F5F3FF" }}
              />
              <button onClick={addStudent} className="rounded-xl px-3" style={{ background: "#FFD873", color: "#12153f" }}>
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {students.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: "#1b2050" }}
                >
                  <span className="text-sm">{name}</span>
                  <button onClick={() => removeStudent(name)} style={{ color: "#8A85C4" }}>
                    <X size={16} />
                  </button>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-xs text-center py-3" style={{ color: "#5B5F91" }}>
                  O&apos;quvchi qo&apos;shilmagan
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showMonthly && <MonthlyReport classId={classId} onClose={() => setShowMonthly(false)} />}
    </div>
  );
}
