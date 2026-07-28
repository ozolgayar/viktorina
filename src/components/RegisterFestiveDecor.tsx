"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

type DecorPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate?: number;
  flipX?: boolean;
  opacity?: number;
  className?: string;
};

/**
 * Декор только для экрана регистрации.
 * Меньше элементов, ближе к карточке: заполняет боковые «провалы»
 * без периферийного разброса и без новых типов декора.
 *
 * Карточка ~max-w ~28rem по центру → safe zone ≈ 28–72% ширины.
 */
const DECOR_SPIRALS: DecorPos[] = [
  // верх лёгкий
  {
    top: "13%",
    left: "12%",
    size: 44,
    rotate: -18,
    opacity: 0.36,
    className: "quiz-intro-decor__spiral--sm",
  },
  {
    top: "10%",
    right: "11%",
    size: 40,
    rotate: 24,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--sm",
  },
  // низ — крупные опоры, чуть ближе к центру чем край экрана
  {
    bottom: "7%",
    left: "8%",
    size: 140,
    rotate: -34,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--lg",
  },
  {
    bottom: "5%",
    right: "9%",
    size: 120,
    rotate: 26,
    flipX: true,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--lg",
  },
];

const DECOR_STARS: DecorPos[] = [
  // верх у карточки
  {
    top: "17%",
    left: "16%",
    size: 48,
    rotate: 16,
    opacity: 0.38,
    className: "quiz-intro-decor__star--md",
  },
  {
    top: "19%",
    right: "15%",
    size: 40,
    rotate: -20,
    opacity: 0.36,
    className: "quiz-intro-decor__star--sm",
  },

  // ——— боковые зоны (средняя высота) — заполняют красные пустоты ———
  {
    top: "38%",
    left: "12%",
    size: 64,
    rotate: -12,
    opacity: 0.38,
    className: "quiz-intro-decor__star--md",
  },
  {
    top: "46%",
    right: "11%",
    size: 52,
    rotate: 22,
    opacity: 0.37,
    className: "quiz-intro-decor__star--md",
  },
  {
    top: "56%",
    left: "14%",
    size: 36,
    rotate: 28,
    opacity: 0.36,
    className: "quiz-intro-decor__star--sm",
  },
  {
    top: "60%",
    right: "14%",
    size: 44,
    rotate: -18,
    opacity: 0.36,
    className: "quiz-intro-decor__star--sm",
  },

  // низ — крупные акценты ближе к карточке, разведены со спиралями
  {
    bottom: "22%",
    left: "11%",
    size: 100,
    rotate: -8,
    opacity: 0.34,
    className: "quiz-intro-decor__star--xl",
  },
  {
    bottom: "26%",
    right: "12%",
    size: 78,
    rotate: 14,
    opacity: 0.34,
    className: "quiz-intro-decor__star--xl",
  },
];

/** Мало мелких — только связки в боковых зонах */
const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  { top: "28%", left: "15%", size: 8, rotate: 30, color: "#8ec8ff", opacity: 0.28 },
  { top: "32%", right: "14%", size: 9, rotate: -24, color: "#a8d8ff", opacity: 0.26 },
  { top: "68%", left: "13%", size: 7, rotate: 18, color: "#7eb6f5", opacity: 0.24 },
  { top: "72%", right: "13%", size: 8, rotate: -32, color: "#9fd0ff", opacity: 0.24 },
];

function decorStyle(item: DecorPos, extra?: CSSProperties): CSSProperties {
  return {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: item.size,
    height: item.size,
    opacity: item.opacity,
    ["--decor-rotate" as string]: `${item.rotate ?? 0}deg`,
    ["--decor-flip" as string]: item.flipX ? "-1" : "1",
    ...extra,
  };
}

/** Декор фона только для экрана регистрации */
export function RegisterFestiveDecor() {
  return (
    <div className="quiz-intro-decor" aria-hidden>
      {DECOR_SPIRALS.map((item, i) => (
        <Image
          key={`spiral-${i}`}
          src="/welcome/spiral.png"
          alt=""
          width={item.size}
          height={item.size}
          className={`quiz-intro-decor__img quiz-intro-decor__spiral ${item.className ?? ""}`}
          style={decorStyle(item, { animationDelay: `${i * 0.4}s` })}
          unoptimized
        />
      ))}
      {DECOR_STARS.map((item, i) => (
        <Image
          key={`star-${i}`}
          src="/welcome/star.png"
          alt=""
          width={item.size}
          height={item.size}
          className={`quiz-intro-decor__img quiz-intro-decor__star ${item.className ?? ""}`}
          style={decorStyle(item, { animationDelay: `${i * 0.32}s` })}
          unoptimized
        />
      ))}
      {DECOR_CONFETTI.map((item, i) => (
        <span
          key={`confetti-${i}`}
          className="quiz-intro-decor__confetti"
          style={decorStyle(item, {
            background: item.color,
            animationDelay: `${i * 0.28}s`,
          })}
        />
      ))}
    </div>
  );
}
