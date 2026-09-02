"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Trophy, CalendarRange } from "lucide-react";
import { api } from "@/lib/api";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function MonthlyReport({ classId, onClose }) {
  const [month, setMonth] = useState(currentMonth());
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getMonthly(classId, month);
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [classId, month]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

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
            <Trophy size={18} /> Oylik hisobot
          </h2>
          <button onClick={onClose} className="p-1 rounded-full" style={{ color: "#8A85C4" }}>
            <X size={20} />
          </button>
        </div>

        <label className="flex items-center gap-2 rounded-xl px-3 py-2 mb-4" style={{ background: "#0e1136" }}>
          <CalendarRange size={16} color="#8A85C4" />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent text-sm w-full outline-none"
            style={{ color: "#F5F3FF", colorScheme: "dark" }}
          />
        </label>

        {error && (
          <div className="rounded-xl px-3 py-2 mb-3 text-xs" style={{ background: "#2a1330", border: "1px solid #5b2a3a", color: "#FF9B9B" }}>
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm py-6 text-center" style={{ color: "#5B5F91" }}>
            Yuklanmoqda...
          </p>
        ) : !data || data.ranked.length === 0 ? (
          <p className="text-sm py-6 text-center" style={{ color: "#5B5F91" }}>
            Bu oyda hali yakunlangan dars yo&apos;q.
          </p>
        ) : (
          <>
            <p className="text-xs mb-3" style={{ color: "#8A85C4" }}>
              {data.lessonCount} dars yakunlangan — mukofot uchun eng yaxshi 3 nafar:
            </p>
            <div className="flex flex-col gap-2">
              {data.ranked.map((r, i) => (
                <div
                  key={r.name}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{
                    background: i < 3 ? "#FFD87322" : "#1b2050",
                    border: `1px solid ${i < 3 ? "#FFD873" : "#2a2f6b"}`,
                  }}
                >
                  <span className="text-lg w-6 text-center">{i < 3 ? MEDALS[i] : i + 1}</span>
                  <span className="flex-1 text-sm font-semibold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {r.name}
                  </span>
                  <span className="text-sm" style={{ color: "#B8A9E8" }}>
                    {r.total} ⭐
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
