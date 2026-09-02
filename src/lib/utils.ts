/** Склонение: 1 участник, 2 участника, 5 участников */
export function declension(n: number): string {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return "участников";
  if (n1 > 1 && n1 < 5) return "участника";
  if (n1 === 1) return "участник";
  return "участников";
}

/** Глагол для плашки: 1 участник прошёл, 2 участника прошли */
export function passedQuizVerb(n: number): string {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (n1 === 1 && !(abs > 10 && abs < 20)) return "прошёл";
  return "прошли";
}

/** Форматирование времени: 19 → "00:19" */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
