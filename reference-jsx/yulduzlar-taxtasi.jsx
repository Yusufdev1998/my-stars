import { useState, useEffect, useMemo } from "react";
import { Star, RotateCcw, Sparkles } from "lucide-react";

const STUDENTS = [
  "Ali", "Vali", "Sardor", "Malika", "Zilola", "Jasur", "Nodira", "Bekzod",
  "Madina", "Sherzod", "Gulnoza", "Aziz", "Diyora", "Otabek", "Sevinch", "Farrux",
  "Nigora", "Islom", "Kamola", "Rustam", "Shahnoza", "Davron", "Ozoda", "Sunnat",
];

const STORAGE_KEY = "yulduzlar-taxtasi-v1";

function starColor(count) {
  if (count >= 5) return "#FFD873";
  if (count >= 3) return "#FFB05C";
  if (count >= 1) return "#B8A9E8";
  return "#3A3F6B";
}

function starSize(count, base = 22) {
  return base + Math.min(count, 6) * 4;
}

export default function StarBoard() {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(STUDENTS.map((s) => [s, 0]))
  );
  const [loaded, setLoaded] = useState(false);
  const [burst, setBurst] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage?.get(STORAGE_KEY, false);
        if (res?.value) {
          const saved = JSON.parse(res.value);
          setCounts((prev) => ({ ...prev, ...saved }));
        }
      } catch (e) {
        // no saved data yet
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.storage?.set(STORAGE_KEY, JSON.stringify(counts), false).catch(() => {});
  }, [counts, loaded]);

  const addStar = (name) => {
    setCounts((c) => ({ ...c, [name]: (c[name] || 0) + 1 }));
    setBurst(name);
    setTimeout(() => setBurst(null), 500);
  };

  const resetAll = () => {
    setCounts(Object.fromEntries(STUDENTS.map((s) => [s, 0])));
  };

  const ranked = useMemo(
    () =>
      [...STUDENTS]
        .map((name) => ({ name, count: counts[name] || 0 }))
        .sort((a, b) => b.count - a.count),
    [counts]
  );

  const top = ranked.filter((r) => r.count > 0).slice(0, 6);

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        fontFamily: "'Quicksand', sans-serif",
        background:
          "radial-gradient(ellipse at 50% -10%, #24296b 0%, #12153f 45%, #0a0c26 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');
        @keyframes twinkle { 0%,100% { opacity: 0.25; } 50% { opacity: 0.9; } }
        @keyframes pop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }
        @keyframes floatUp { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-28px); } }
        .bgdot { position: absolute; border-radius: 9999px; background: white; animation: twinkle 3s ease-in-out infinite; }
        .pop { animation: pop 0.4s ease; }
        .burst { animation: floatUp 0.5s ease forwards; }
      `}</style>

      {/* Ambient background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 45 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          return (
            <span
              key={i}
              className="bgdot"
              style={{
                width: size,
                height: size,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          );
        })}
      </div>

      <div className="relative max-w-4xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFD873" }}
            >
              <Sparkles size={30} strokeWidth={2.5} />
              Yulduzlar Osmoni
            </h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: "#B8A9E8" }}>
              1-sinf yutuqlar taxtasi
            </p>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-full border transition-colors"
            style={{ borderColor: "#3A3F6B", color: "#B8A9E8" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1B2456")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <RotateCcw size={14} />
            Yangi dars
          </button>
        </div>

        {/* Top sky */}
        <div
          className="rounded-3xl p-6 mb-8 relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #171b4d 0%, #0e1136 100%)" }}
        >
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
                <div key={r.name} className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <Star
                      fill={starColor(r.count)}
                      color={starColor(r.count)}
                      size={starSize(r.count, i === 0 ? 34 : 24)}
                      className={burst === r.name ? "pop" : ""}
                      style={{
                        filter: `drop-shadow(0 0 ${6 + r.count}px ${starColor(r.count)}88)`,
                      }}
                    />
                    {i === 0 && (
                      <span className="absolute -top-2 -right-2 text-xs">👑</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {r.name}
                  </span>
                  <span className="text-xs" style={{ color: "#8A85C4" }}>
                    {r.count} yulduz
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Whole class grid */}
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#8A85C4" }}>
          Sinf osmoni — bosing va yulduz yoqing
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {STUDENTS.map((name) => {
            const count = counts[name] || 0;
            return (
              <button
                key={name}
                onClick={() => addStar(name)}
                className="relative flex flex-col items-center gap-1.5 rounded-2xl py-4 px-2 transition-transform active:scale-95"
                style={{
                  background: "#151a44",
                  border: `1px solid ${count > 0 ? "#3A3F6B" : "#20244f"}`,
                }}
              >
                <Star
                  fill={starColor(count)}
                  color={starColor(count)}
                  size={starSize(count, 20)}
                  className={burst === name ? "pop" : ""}
                  style={{
                    filter: count > 0 ? `drop-shadow(0 0 6px ${starColor(count)}77)` : "none",
                  }}
                />
                <span className="text-xs font-semibold text-center leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {name}
                </span>
                <span className="text-[11px]" style={{ color: "#6B70A8" }}>
                  {count}
                </span>
                {burst === name && (
                  <span className="burst absolute top-1 text-xs" style={{ color: "#FFD873" }}>
                    +1
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-center mt-8 pb-4" style={{ color: "#5B5F91" }}>
          Maslahat: bir darsda 6–8 nafar bolani yorqin yulduz sifatida ko'rsating — har hafta boshqa bolalar navbat bilan yorqin bo'lsin.
        </p>
      </div>
    </div>
  );
}
