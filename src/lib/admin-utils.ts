import type { AdminSession, SortDirection, SortField } from "@/types/admin";

/** Формат даты: ДД.ММ.ГГГГ ЧЧ:ММ */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Длительность прохождения в минутах */
export function getDurationMinutes(
  startedAt: string,
  finishedAt: string
): number {
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  return Math.max(0, Math.round(ms / 60000));
}

/** Цвет результата по баллам */
export function getScoreColor(score: number | null): string {
  if (score === null) return "#6B7280";
  if (score >= 8) return "#00A88E";
  if (score >= 5) return "#F5821F";
  return "#EF4444";
}

/** Имя файла Excel с текущей датой */
export function getExportFilename(tab: "all" | "winners"): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return tab === "all"
    ? `gerofarm_quiz_все_результаты_${date}.xlsx`
    : `gerofarm_quiz_победители_${date}.xlsx`;
}

/** Сортировка сессий */
export function sortSessions(
  sessions: AdminSession[],
  field: SortField,
  direction: SortDirection
): AdminSession[] {
  const sorted = [...sessions].sort((a, b) => {
    let cmp = 0;

    switch (field) {
      case "full_name":
        cmp = a.full_name.localeCompare(b.full_name, "ru");
        break;
      case "email":
        cmp = a.email.localeCompare(b.email);
        break;
      case "score":
        cmp = (a.score ?? -1) - (b.score ?? -1);
        break;
      case "finished_at":
        cmp =
          new Date(a.finished_at ?? 0).getTime() -
          new Date(b.finished_at ?? 0).getTime();
        break;
      case "duration": {
        const durA =
          a.finished_at && a.started_at
            ? getDurationMinutes(a.started_at, a.finished_at)
            : 0;
        const durB =
          b.finished_at && b.started_at
            ? getDurationMinutes(b.started_at, b.finished_at)
            : 0;
        cmp = durA - durB;
        break;
      }
    }

    return direction === "asc" ? cmp : -cmp;
  });

  return sorted;
}

/** Фильтр по поисковому запросу (ФИО и email) */
export function filterSessions(
  sessions: AdminSession[],
  query: string
): AdminSession[] {
  const q = query.trim().toLowerCase();
  if (!q) return sessions;
  return sessions.filter(
    (s) =>
      s.full_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
  );
}

/** Статистика по всем сессиям */
export function computeStats(sessions: AdminSession[]) {
  const finished = sessions.filter((s) => s.finished_at !== null);
  const scores = finished
    .map((s) => s.score)
    .filter((s): s is number => s !== null);

  return {
    total: sessions.length,
    finished: finished.length,
    averageScore:
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
          10
        : 0,
    bestScore: scores.length > 0 ? Math.max(...scores) : 0,
  };
}
