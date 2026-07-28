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
 * Обрамление карточки без пересечений:
 * верх/бока — лёгкие акценты ближе к форме,
 * низ — более крупные «опоры» в углах, разведённые по зонам.
 *
 * Карточка регистрации ~max-w ~28rem по центру ≈ 28–72% ширины.
 * Держим декор вне ~24–76% по X и не залезаем на края карточки.
 */
const DECOR_SPIRALS: DecorPos[] = [
  // верх слева — мелкая, у верхнего угла карточки
  {
    top: "14%",
    left: "11%",
    size: 42,
    rotate: -20,
    opacity: 0.36,
    className: "quiz-intro-decor__spiral--sm",
  },
  // верх справа — другая высота, не зеркало
  {
    top: "11%",
    right: "10%",
    size: 36,
    rotate: 26,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--sm",
  },
  // низ слева — крупная опора (зона отдельно от звезды)
  {
    bottom: "8%",
    left: "6%",
    size: 132,
    rotate: -34,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--lg",
  },
  // низ справа — чуть выше и меньше, не рядом с левой
  {
    bottom: "4%",
    right: "7%",
    size: 110,
    rotate: 22,
    flipX: true,
    opacity: 0.35,
    className: "quiz-intro-decor__spiral--lg",
  },
];

const DECOR_STARS: DecorPos[] = [
  // верхняя зона у карточки (между спиралями по высоте)
  {
    top: "18%",
    right: "16%",
    size: 44,
    rotate: 14,
    opacity: 0.38,
    className: "quiz-intro-decor__star--sm",
  },
  // боковой акцент слева, середина высоты
  {
    top: "46%",
    left: "8%",
    size: 48,
    rotate: -16,
    opacity: 0.37,
    className: "quiz-intro-decor__star--md",
  },
  // боковой акцент справа, выше середины — не на одной линии
  {
    top: "38%",
    right: "8%",
    size: 36,
    rotate: 28,
    opacity: 0.4,
    className: "quiz-intro-decor__star--sm",
  },
  // крупная снизу слева — выше спирали, без overlap
  {
    bottom: "22%",
    left: "9%",
    size: 92,
    rotate: -8,
    opacity: 0.34,
    className: "quiz-intro-decor__star--xl",
  },
];

const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  // верх у карточки
  { top: "16%", left: "20%", size: 8, rotate: 28, color: "#8ec8ff", opacity: 0.28 },
  { top: "13%", right: "22%", size: 10, rotate: -22, color: "#a8d8ff", opacity: 0.26 },
  // бока ближе к форме
  { top: "52%", left: "14%", size: 7, rotate: 36, color: "#7eb6f5", opacity: 0.24 },
  { top: "58%", right: "13%", size: 9, rotate: -30, color: "#9fd0ff", opacity: 0.26 },
  // лёгкий ритм снизу справа (далеко от крупной спирали)
  { bottom: "18%", right: "18%", size: 6, rotate: 16, color: "#b8dfff", opacity: 0.22 },
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
