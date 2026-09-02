import { useState, useEffect, useMemo } from "react";
import { Star, X, RotateCcw, Sparkles, Crown, Check } from "lucide-react";

const STUDENTS = [
  "Ali", "Vali", "Sardor", "Malika", "Zilola", "Jasur", "Nodira", "Bekzod",
  "Madina", "Sherzod", "Gulnoza", "Aziz", "Diyora", "Otabek", "Sevinch", "Farrux",
  "Nigora", "Islom", "Kamola", "Rustam", "Shahnoza", "Davron", "Ozoda", "Sunnat",
];

const REASONS = [
  { id: "ishtirok", emoji: "🙋", label: "Ishtirok", desc: "Darsda faol qatnashding" },
  { id: "javob", emoji: "✅", label: "To'g'ri javob", desc: "Savolga to'g'ri javob berding" },
  { id: "yordam", emoji: "🤝", label: "Yordam", desc: "Do'stingga yordam berding" },
  { id: "intizom", emoji: "🧘", label: "Intizom", desc: "Diqqat bilan, tartibli o'tirding" },
  { id: "faol", emoji: "🌟", label: "Eng faol", desc: "Butun dars davomida a'lo bo'lding" },
];

const STORAGE_KEY = "yulduzlar-taxtasi-v2";
const LAVENDER = [184, 169, 232];
const GOLD = [255, 216, 115];

function levelColor(count) {
  const t = Math.max(0, Math.min(1, (count - 1) / (REASONS.length - 1)));
  const r = Math.round(LAVENDER[0] + (GOLD[0] - LAVENDER[0]) * t);
  const g = Math.round(LAVENDER[1] + (GOLD[1] - LAVENDER[1]) * t);
  const b = Math.round(LAVENDER[2] + (GOLD[2] - LAVENDER[2]) * t);
  return `rgb(${r},${g},${b})`;
}

function emptyState() {
  return Object.fromEntries(STUDENTS.map((s) => [s, []]));
}

export default function StarBoardV2() {
  const [data, setData] = useState(emptyState());
  const [loaded, setLoaded] = useState(false);
  const [openStudent, setOpenStudent] = useState(null);
  const [celebrate, setCelebrate] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage?.get(STORAGE_KEY, false);
        if (res?.value) setData((d) => ({ ...d, ...JSON.parse(res.value) }));
      } catch (e) {
        // no saved data yet
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.storage?.set(STORAGE_KEY, JSON.stringify(data), false).catch(() => {});
  }, [data, loaded]);

  const toggleReason = (name, reasonId) => {
    setData((d) => {
      const current = d[name] || [];
      const has = current.includes(reasonId);
      const next = has ? current.filter((r) => r !== reasonId) : [...current, reasonId];
      if (!has && next.length === REASONS.length) {
        setCelebrate(name);
        setTimeout(() => setCelebrate(null), 1400);
      }
      return { ...d, [name]: next };
    });
  };

  const resetAll = () => {
    setData(emptyState());
    setOpenStudent(null);
  };

  const ranked = useMemo(
    () =>
      STUDENTS.map((name) => ({ name, count: (data[name] || []).length }))
        .sort((a, b) => b.count - a.count),
    [data]
  );
  const top = ranked.filter((r) => r.count > 0).slice(0, 6);

  return (
    <div
      className="min-h-screen w-full text-white relative"
      style={{
        fontFamily: "'Quicksand', sans-serif",
        background: "radial-gradient(ellipse at 50% -10%, #24296b 0%, #12153f 45%, #0a0c26 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');
        @keyframes twinkle { 0%,100% { opacity: 0.25; } 50% { opacity: 0.9; } }
        @keyframes pop { 0% { transform: scale(1); } 45% { transform: scale(1.3) rotate(-6deg); } 100% { transform: scale(1); } }
        @keyframes riseIn { 0% { opacity: 0; transform: translateY(14px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-60px) rotate(360deg); opacity: 0; } }
        .bgdot { position: absolute; border-radius: 9999px; background: white; animation: twinkle 3s ease-in-out infinite; }
        .pop { animation: pop 0.45s ease; }
        .riseIn { animation: riseIn 0.22s ease; }
        .confetti { position: absolute; animation: confetti 1.1s ease forwards; font-size: 18px; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 45 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          return (
            <span key={i} className="bgdot" style={{
              width: size, height: size, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
          );
        })}
      </div>

      {celebrate && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-start justify-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="confetti" style={{
              left: `${45 + Math.random() * 10}%`, top: `${18 + Math.random() * 10}%`,
              animationDelay: `${Math.random() * 0.3}s`,
            }}>
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
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}>
              <Sparkles size={30} strokeWidth={2.5} />
              Yulduzlar Osmoni
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: "#B8A9E8" }}>
              Bosing — sabab tanlang — yulduz yonadi ✨
            </p>
          </div>
          <button onClick={resetAll}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-full border shrink-0"
            style={{ borderColor: "#3A3F6B", color: "#B8A9E8" }}>
            <RotateCcw size={14} />
            Yangi dars
          </button>
        </div>

        {/* Top sky */}
        <div className="rounded-3xl p-6 mb-8"
          style={{ background: "linear-gradient(180deg, #171b4d 0%, #0e1136 100%)" }}>
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
                    <Star fill={levelColor(r.count)} color={levelColor(r.count)}
                      size={i === 0 ? 34 + r.count * 2 : 22 + r.count * 2}
                      style={{ filter: `drop-shadow(0 0 ${6 + r.count * 2}px ${levelColor(r.count)}aa)` }} />
                    {i === 0 && <Crown size={16} className="absolute -top-3 -right-2" color="#FFD873" fill="#FFD873" />}
                  </div>
                  <span className="text-sm font-semibold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{r.name}</span>
                  <span className="text-xs" style={{ color: "#8A85C4" }}>{r.count}/5</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Class grid */}
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#8A85C4" }}>
          Sinf osmoni — bosing va sabab tanlang
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {STUDENTS.map((name) => {
            const reasons = data[name] || [];
            const count = reasons.length;
            return (
              <button key={name} onClick={() => setOpenStudent(name)}
                className="flex flex-col items-center gap-2 rounded-2xl py-4 px-2 transition-transform active:scale-95"
                style={{ background: "#151a44", border: `1px solid ${count > 0 ? "#3A3F6B" : "#20244f"}` }}>
                <Star fill={levelColor(count) === "rgb(184,169,232)" && count === 0 ? "#3A3F6B" : levelColor(count)}
                  color={count === 0 ? "#3A3F6B" : levelColor(count)}
                  size={20 + count * 2.5}
                  style={{ filter: count > 0 ? `drop-shadow(0 0 6px ${levelColor(count)}77)` : "none" }} />
                <span className="text-xs font-semibold text-center leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {name}
                </span>
                {/* mini staircase */}
                <div className="flex items-end gap-0.5 h-3">
                  {REASONS.map((rs, i) => (
                    <span key={rs.id} className="rounded-sm" style={{
                      width: 4, height: 3 + i * 2,
                      background: reasons.includes(rs.id) ? levelColor(i + 1) : "#2b2f63",
                    }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-center mt-8 pb-4" style={{ color: "#5B5F91" }}>
          Har sababdan bittadan — bir darsda maksimal 5 ta yulduz.
        </p>
      </div>

      {/* Reason picker modal */}
      {openStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(6,7,26,0.72)" }}
          onClick={() => setOpenStudent(null)}>
          <div className="w-full max-w-sm rounded-3xl p-5 riseIn"
            style={{ background: "#12153f", border: "1px solid #2a2f6b" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}>
                {openStudent}
              </h2>
              <button onClick={() => setOpenStudent(null)} className="p-1 rounded-full" style={{ color: "#8A85C4" }}>
                <X size={20} />
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: "#8A85C4" }}>
              {(data[openStudent] || []).length}/5 yulduz — sabab tanlang
            </p>
            <div className="flex flex-col gap-2">
              {REASONS.map((r, i) => {
                const earned = (data[openStudent] || []).includes(r.id);
                return (
                  <button key={r.id} onClick={() => toggleReason(openStudent, r.id)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${earned ? "pop" : ""}`}
                    style={{
                      background: earned ? `${levelColor(i + 1)}22` : "#1b2050",
                      border: `1px solid ${earned ? levelColor(i + 1) : "#2a2f6b"}`,
                    }}>
                    <span className="text-xl">{r.emoji}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                        {r.label}
                      </span>
                      <span className="block text-xs" style={{ color: "#8A85C4" }}>{r.desc}</span>
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
    </div>
  );
}
