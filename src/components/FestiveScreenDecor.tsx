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
 * Плотное асимметричное обрамление карточки.
 * Карточка ~по центру (≈26–74% ширины) — декор вне этой зоны + safe gap.
 * Иерархия: крупные опоры → средние акценты у формы → мелкий ритм.
 */
const DECOR_SPIRALS: DecorPos[] = [
  // ——— крупные (композиция) ———
  {
    bottom: "5%",
    left: "3%",
    size: 168,
    rotate: -38,
    opacity: 0.36,
    className: "quiz-intro-decor__spiral--lg",
  },
  {
    bottom: "3%",
    right: "4%",
    size: 148,
    rotate: 28,
    flipX: true,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--lg",
  },
  {
    top: "42%",
    left: "1.5%",
    size: 118,
    rotate: -42,
    opacity: 0.3,
    className: "quiz-intro-decor__spiral--lg",
  },

  // ——— средние у карточки ———
  {
    top: "12%",
    left: "9%",
    size: 52,
    rotate: -16,
    opacity: 0.38,
    className: "quiz-intro-decor__spiral--sm",
  },
  {
    top: "9%",
    right: "8%",
    size: 44,
    rotate: 22,
    opacity: 0.36,
    className: "quiz-intro-decor__spiral--sm",
  },
  {
    top: "58%",
    right: "2%",
    size: 72,
    rotate: 34,
    flipX: true,
    opacity: 0.32,
    className: "quiz-intro-decor__spiral--sm",
  },
  {
    bottom: "28%",
    left: "14%",
    size: 58,
    rotate: -24,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--sm",
  },
];

const DECOR_STARS: DecorPos[] = [
  // ——— крупные акценты ———
  {
    bottom: "20%",
    left: "7%",
    size: 118,
    rotate: -10,
    opacity: 0.36,
    className: "quiz-intro-decor__star--xl",
  },
  {
    bottom: "14%",
    right: "9%",
    size: 96,
    rotate: 18,
    opacity: 0.34,
    className: "quiz-intro-decor__star--xl",
  },
  {
    top: "28%",
    right: "5%",
    size: 88,
    rotate: -6,
    opacity: 0.33,
    className: "quiz-intro-decor__star--xl",
  },

  // ——— средние у формы ———
  {
    top: "16%",
    left: "15%",
    size: 54,
    rotate: 20,
    opacity: 0.4,
    className: "quiz-intro-decor__star--md",
  },
  {
    top: "20%",
    right: "14%",
    size: 46,
    rotate: -22,
    opacity: 0.38,
    className: "quiz-intro-decor__star--md",
  },
  {
    top: "48%",
    left: "10%",
    size: 62,
    rotate: 12,
    opacity: 0.37,
    className: "quiz-intro-decor__star--md",
  },
  {
    top: "52%",
    right: "11%",
    size: 50,
    rotate: -28,
    opacity: 0.38,
    className: "quiz-intro-decor__star--md",
  },
  {
    bottom: "32%",
    right: "16%",
    size: 42,
    rotate: 32,
    opacity: 0.36,
    className: "quiz-intro-decor__star--md",
  },

  // ——— мелкие ритм ———
  {
    top: "34%",
    left: "17%",
    size: 28,
    rotate: -14,
    opacity: 0.4,
    className: "quiz-intro-decor__star--sm",
  },
  {
    top: "38%",
    right: "17%",
    size: 24,
    rotate: 40,
    opacity: 0.38,
    className: "quiz-intro-decor__star--sm",
  },
  {
    bottom: "38%",
    left: "18%",
    size: 32,
    rotate: 8,
    opacity: 0.36,
    className: "quiz-intro-decor__star--sm",
  },
];

const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  { top: "11%", left: "20%", size: 9, rotate: 28, color: "#8ec8ff", opacity: 0.3 },
  { top: "14%", right: "19%", size: 11, rotate: -20, color: "#a8d8ff", opacity: 0.28 },
  { top: "22%", left: "12%", size: 7, rotate: 42, color: "#7eb6f5", opacity: 0.26 },
  { top: "26%", right: "12%", size: 8, rotate: -34, color: "#9fd0ff", opacity: 0.28 },
  { top: "41%", left: "15%", size: 6, rotate: 18, color: "#b8dfff", opacity: 0.24 },
  { top: "44%", right: "15%", size: 10, rotate: -12, color: "#8ec8ff", opacity: 0.26 },
  { top: "62%", left: "12%", size: 8, rotate: 36, color: "#a8d8ff", opacity: 0.25 },
  { top: "66%", right: "13%", size: 7, rotate: -28, color: "#7eb6f5", opacity: 0.24 },
  { bottom: "24%", left: "16%", size: 9, rotate: 22, color: "#9fd0ff", opacity: 0.26 },
  { bottom: "22%", right: "20%", size: 6, rotate: -40, color: "#b8dfff", opacity: 0.22 },
  { bottom: "42%", left: "8%", size: 7, rotate: 14, color: "#8ec8ff", opacity: 0.24 },
  { top: "72%", right: "7%", size: 8, rotate: 30, color: "#a8d8ff", opacity: 0.25 },
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

/** Общий приглушённый праздничный декор для фиолетовых экранов */
export function FestiveScreenDecor() {
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
          style={decorStyle(item, { animationDelay: `${i * 0.35}s` })}
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
          style={decorStyle(item, { animationDelay: `${i * 0.28}s` })}
          unoptimized
        />
      ))}
      {DECOR_CONFETTI.map((item, i) => (
        <span
          key={`confetti-${i}`}
          className="quiz-intro-decor__confetti"
          style={decorStyle(item, {
            background: item.color,
            animationDelay: `${i * 0.22}s`,
          })}
        />
      ))}
    </div>
  );
}
