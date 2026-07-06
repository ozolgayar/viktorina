/** Конфигурация викторины из переменных окружения */

export const QUIZ_CONFIG = {
  timeLimitMinutes: Number(process.env.QUIZ_TIME_LIMIT_MINUTES ?? 25),
  questionsCount: Number(process.env.QUIZ_QUESTIONS_COUNT ?? 10),
  eventDate: process.env.QUIZ_EVENT_DATE ?? "",
  startHour: Number(process.env.QUIZ_START_HOUR ?? 10),
  endHour: Number(process.env.QUIZ_END_HOUR ?? 17),
  timezone: process.env.QUIZ_TIMEZONE ?? "Europe/Moscow",
  skipTimeWindow: process.env.QUIZ_SKIP_TIME_WINDOW === "true",
} as const;

/**
 * Проверка доступности викторины по серверному времени.
 * Окно: указанный день, с startHour до endHour в заданном часовом поясе.
 */
export function isQuizAvailable(now: Date = new Date()): {
  available: boolean;
  message?: string;
} {
  if (QUIZ_CONFIG.skipTimeWindow) {
    return { available: true };
  }

  // Текущее время в нужном часовом поясе
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: QUIZ_CONFIG.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const currentDate = `${get("year")}-${get("month")}-${get("day")}`;
  const currentHour = Number(get("hour"));

  // Проверка даты события
  if (QUIZ_CONFIG.eventDate && currentDate !== QUIZ_CONFIG.eventDate) {
    return {
      available: false,
      message: `Викторина доступна ${formatEventDate(QUIZ_CONFIG.eventDate)} с ${QUIZ_CONFIG.startHour}:00 до ${QUIZ_CONFIG.endHour}:00 (МСК).`,
    };
  }

  // Проверка временного окна
  if (currentHour < QUIZ_CONFIG.startHour || currentHour >= QUIZ_CONFIG.endHour) {
    return {
      available: false,
      message: `Викторина доступна с ${QUIZ_CONFIG.startHour}:00 до ${QUIZ_CONFIG.endHour}:00 (МСК).`,
    };
  }

  return { available: true };
}

function formatEventDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

/**
 * Проверка, что сессия не превысила лимит времени (по серверным меткам).
 */
export function isWithinTimeLimit(
  startedAt: string,
  finishedAt: Date = new Date()
): boolean {
  const start = new Date(startedAt).getTime();
  const finish = finishedAt.getTime();
  const limitMs = QUIZ_CONFIG.timeLimitMinutes * 60 * 1000;
  return finish - start <= limitMs;
}

/** Оставшееся время в секундах */
export function getRemainingSeconds(startedAt: string, now: Date = new Date()): number {
  const start = new Date(startedAt).getTime();
  const limitMs = QUIZ_CONFIG.timeLimitMinutes * 60 * 1000;
  const elapsed = now.getTime() - start;
  const remaining = Math.ceil((limitMs - elapsed) / 1000);
  return Math.max(0, remaining);
}

/** Перемешивание массива (Fisher-Yates) */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Валидация email */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Валидация ФИО — минимум 2 слова */
export function isValidFullName(name: string): boolean {
  return name.trim().split(/\s+/).filter(Boolean).length >= 2;
}

/** Форматирование секунд в MM:SS */
export function formatTime(seconds: number): { minutes: string; secs: string } {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return {
    minutes: String(m).padStart(2, "0"),
    secs: String(s).padStart(2, "0"),
  };
}
