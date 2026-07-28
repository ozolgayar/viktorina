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
 * Схема регистрации (номера кружков):
 * маленький кружок → крупный элемент;
 * большой кружок → ещё крупнее.
 *
 * 1,2,11 — средние маркеры → крупные
 * 4,6,7,9 — мелкие маркеры → крупные
 * 5,8,10,12 — крупные маркеры → самые крупные
 * (№3 на схеме нет)
 */
const DECOR_SPIRALS: DecorPos[] = [
  // #4 — низ слева
  {
    bottom: "7%",
    left: "7%",
    size: 118,
    rotate: -32,
    opacity: 0.36,
    className: "quiz-intro-decor__spiral--sm",
  },
  // #5 — далеко слева по центру (самый крупный)
  {
    top: "40%",
    left: "2%",
    size: 188,
    rotate: -40,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--lg",
  },
  // #9 — верхний правый угол (уменьшен по правке)
  {
    top: "8%",
    right: "4%",
    size: 68,
    rotate: 28,
    opacity: 0.36,
    className: "quiz-intro-decor__spiral--sm",
  },
  // #10 — справа по центру (уменьшен по правке)
  {
    top: "44%",
    right: "1.5%",
    size: 100,
    rotate: 34,
    flipX: true,
    opacity: 0.34,
    className: "quiz-intro-decor__spiral--lg",
  },
  // #12 — низ справа (самый крупный)
  {
    bottom: "6%",
    right: "7%",
    size: 168,
    rotate: 24,
    flipX: true,
    opacity: 0.35,
    className: "quiz-intro-decor__spiral--lg",
  },
];

const DECOR_STARS: DecorPos[] = [
  // #2 — слева у нижней части карточки
  {
    top: "58%",
    left: "14%",
    size: 124,
    rotate: 16,
    opacity: 0.36,
    className: "quiz-intro-decor__star--xl",
  },
  // #6 — верх слева
  {
    top: "13%",
    left: "10%",
    size: 108,
    rotate: 18,
    opacity: 0.38,
    className: "quiz-intro-decor__star--md",
  },
  // #7 — над карточкой справа
  {
    top: "11%",
    right: "22%",
    size: 102,
    rotate: -22,
    opacity: 0.37,
    className: "quiz-intro-decor__star--md",
  },
  // #8 — справа у верхней части карточки (самый крупный)
  {
    top: "24%",
    right: "9%",
    size: 172,
    rotate: 10,
    opacity: 0.34,
    className: "quiz-intro-decor__star--xl",
  },
  // #11 — справа у нижней/средней части карточки
  {
    top: "52%",
    right: "13%",
    size: 128,
    rotate: -18,
    opacity: 0.36,
    className: "quiz-intro-decor__star--xl",
  },
];

/** Квадратики в точках схемы как лёгкие связки рядом с крупными акцентами */
const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  // левая верхняя зона
  { top: "34%", left: "24%", size: 22, rotate: 28, color: "#8ec8ff", opacity: 0.32 },
  // рядом с #2 — сдвинут вправо от звезды
  { top: "66%", left: "23%", size: 18, rotate: -24, color: "#a8d8ff", opacity: 0.3 },
  // рядом с #7/#8
  { top: "18%", right: "16%", size: 20, rotate: 36, color: "#7eb6f5", opacity: 0.28 },
  // рядом с #11/#12
  { bottom: "20%", right: "18%", size: 16, rotate: -30, color: "#9fd0ff", opacity: 0.28 },
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

/** Декор регистрации строго по схеме с номерами */
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
