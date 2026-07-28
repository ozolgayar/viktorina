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
 * Асимметричный декор по периметру:
 * верх легче, низ плотнее, центр карточки чистый.
 */
const DECOR_SPIRALS: DecorPos[] = [
  // верх слева — мелкая, с воздухом от угла
  {
    top: "10%",
    left: "5.5%",
    size: 38,
    rotate: -22,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--sm",
  },
  // верх справа — чуть ниже и крупнее, не зеркало
  {
    top: "15%",
    right: "6.5%",
    size: 46,
    rotate: 18,
    opacity: 0.32,
    className: "quiz-intro-decor__spiral--sm",
  },
  // низ слева — крупная «опора»
  {
    bottom: "11%",
    left: "4%",
    size: 148,
    rotate: -36,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--lg",
  },
  // низ справа — другая высота и размер
  {
    bottom: "6%",
    right: "5%",
    size: 122,
    rotate: 24,
    flipX: true,
    opacity: 0.36,
    className: "quiz-intro-decor__spiral--lg",
  },
];

const DECOR_STARS: DecorPos[] = [
  // акцент слева, ниже верхней спирали
  {
    top: "26%",
    left: "7%",
    size: 40,
    rotate: -18,
    opacity: 0.38,
    className: "quiz-intro-decor__star--sm",
  },
  // справа выше середины, другой размер
  {
    top: "33%",
    right: "5%",
    size: 58,
    rotate: 22,
    opacity: 0.36,
    className: "quiz-intro-decor__star--md",
  },
  // крупная внизу слева — заземление
  {
    bottom: "15%",
    left: "5.5%",
    size: 108,
    rotate: -6,
    opacity: 0.34,
    className: "quiz-intro-decor__star--xl",
  },
  // маленькая справа снизу, не на одной линии с крупной
  {
    bottom: "28%",
    right: "7.5%",
    size: 34,
    rotate: 34,
    opacity: 0.4,
    className: "quiz-intro-decor__star--sm",
  },
];

const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  { top: "7%", left: "21%", size: 8, rotate: 28, color: "#8ec8ff", opacity: 0.28 },
  { top: "18%", right: "14%", size: 12, rotate: -24, color: "#a8d8ff", opacity: 0.3 },
  { top: "44%", left: "3.5%", size: 9, rotate: 40, color: "#7eb6f5", opacity: 0.26 },
  { bottom: "36%", right: "3.5%", size: 7, rotate: -32, color: "#9fd0ff", opacity: 0.28 },
  { top: "38%", right: "11%", size: 6, rotate: 18, color: "#b8dfff", opacity: 0.24 },
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
          style={decorStyle(item, { animationDelay: `${i * 0.45}s` })}
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
          style={decorStyle(item, { animationDelay: `${i * 0.4}s` })}
          unoptimized
        />
      ))}
      {DECOR_CONFETTI.map((item, i) => (
        <span
          key={`confetti-${i}`}
          className="quiz-intro-decor__confetti"
          style={decorStyle(item, {
            background: item.color,
            animationDelay: `${i * 0.3}s`,
          })}
        />
      ))}
    </div>
  );
}
