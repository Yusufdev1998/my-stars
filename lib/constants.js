export const REASONS = [
  { id: "ishtirok", emoji: "🙋", label: "Ishtirok", desc: "Darsda faol qatnashding" },
  { id: "javob", emoji: "✅", label: "To'g'ri javob", desc: "Savolga to'g'ri javob berding" },
  { id: "yordam", emoji: "🤝", label: "Yordam", desc: "Do'stingga yordam berding" },
  { id: "intizom", emoji: "🧘", label: "Intizom", desc: "Diqqat bilan, tartibli o'tirding" },
  { id: "faol", emoji: "🌟", label: "Eng faol", desc: "Butun dars davomida a'lo bo'lding" },
];

export const LAVENDER = [184, 169, 232];
export const GOLD = [255, 216, 115];

export function levelColor(count) {
  const t = Math.max(0, Math.min(1, (count - 1) / (REASONS.length - 1)));
  const r = Math.round(LAVENDER[0] + (GOLD[0] - LAVENDER[0]) * t);
  const g = Math.round(LAVENDER[1] + (GOLD[1] - LAVENDER[1]) * t);
  const b = Math.round(LAVENDER[2] + (GOLD[2] - LAVENDER[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
