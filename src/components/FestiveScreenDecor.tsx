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
  className?: string;
};

/** Приглушённый декор вокруг контента (без шариков и торта) */
const DECOR_SPIRALS: DecorPos[] = [
  { top: "8%", left: "3%", size: 48, rotate: -18, className: "quiz-intro-decor__spiral--sm" },
  { top: "12%", right: "4%", size: 54, rotate: 24, className: "quiz-intro-decor__spiral--sm" },
  {
    bottom: "10%",
    left: "1%",
    size: 130,
    rotate: -32,
    className: "quiz-intro-decor__spiral--lg",
  },
  {
    bottom: "8%",
    right: "1%",
    size: 140,
    rotate: 28,
    flipX: true,
    className: "quiz-intro-decor__spiral--lg",
  },
];

const DECOR_STARS: DecorPos[] = [
  { top: "18%", left: "6%", size: 56, rotate: -14, className: "quiz-intro-decor__star--md" },
  { top: "22%", right: "5%", size: 68, rotate: 16, className: "quiz-intro-decor__star--md" },
  { bottom: "18%", left: "4%", size: 120, rotate: -8, className: "quiz-intro-decor__star--xl" },
  { bottom: "22%", right: "6%", size: 44, rotate: 30, className: "quiz-intro-decor__star--sm" },
];

const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  { top: "14%", left: "18%", size: 11, rotate: 28, color: "#8ec8ff" },
  { top: "10%", right: "20%", size: 10, rotate: -20, color: "#a8d8ff" },
  { bottom: "28%", left: "12%", size: 11, rotate: 35, color: "#7eb6f5" },
  { bottom: "30%", right: "14%", size: 11, rotate: -28, color: "#9fd0ff" },
];

function decorStyle(item: DecorPos, extra?: CSSProperties): CSSProperties {
  return {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: item.size,
    height: item.size,
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
          style={decorStyle(item, { animationDelay: `${i * 0.35}s` })}
          unoptimized
        />
      ))}
      {DECOR_CONFETTI.map((item, i) => (
        <span
          key={`confetti-${i}`}
          className="quiz-intro-decor__confetti"
          style={decorStyle(item, {
            background: item.color,
            animationDelay: `${i * 0.25}s`,
          })}
        />
      ))}
    </div>
  );
}
