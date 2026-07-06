"use client";

import { formatTime } from "@/lib/quiz-config";

interface TimerProps {
  remainingSeconds: number;
  warning?: boolean;
  /** inline — без вертикальных отступов (для десктопной шапки викторины) */
  inline?: boolean;
}

/** Компактный таймер — белая таблетка с тёмным текстом */
export function Timer({ remainingSeconds, warning = false, inline = false }: TimerProps) {
  const { minutes, secs } = formatTime(remainingSeconds);

  return (
    <div
      className={`flex justify-center ${inline ? "py-0" : "py-3"} ${warning ? "timer-warning" : ""}`}
      aria-live="polite"
      aria-label={`Осталось ${minutes} минут ${secs} секунд`}
    >
      <span className="inline-flex items-center rounded-full bg-white px-5 py-2 text-lg font-semibold tabular-nums text-brand-dark shadow-md md:px-6 md:py-2.5 md:text-xl">
        {minutes}:{secs}
      </span>
    </div>
  );
}
