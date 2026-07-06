/** Склонение: 1 участник, 2 участника, 5 участников */
export function declension(n: number): string {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return "участников";
  if (n1 > 1 && n1 < 5) return "участника";
  if (n1 === 1) return "участник";
  return "участников";
}

/** Форматирование времени: 125 → "2:05" */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
