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
  offsetX?: number;
  offsetY?: number;
  flipX?: boolean;
  className?: string;
};

const DECOR_SPIRALS: DecorPos[] = [
  { top: "7%", left: "9%", size: 42, rotate: -18, className: "welcome-decor__spiral--sm" },
  { top: "26%", left: "2%", size: 168, rotate: -38, className: "welcome-decor__spiral--lg" },
  { top: "22%", right: "6%", size: 50, rotate: 22, className: "welcome-decor__spiral--sm" },
  {
    bottom: "8%",
    right: "2%",
    size: 155,
    rotate: 30,
    offsetX: -100,
    offsetY: -100,
    flipX: true,
    className: "welcome-decor__spiral--lg",
  },
];

const DECOR_STARS: DecorPos[] = [
  { bottom: "5%", left: "3%", size: 168, rotate: -8, className: "welcome-decor__star--xl" },
  {
    top: "46%",
    left: "9%",
    size: 52,
    rotate: 14 + 45,
    offsetX: 200,
    offsetY: 50,
    className: "welcome-decor__star--md",
  },
  {
    top: "38%",
    right: "8%",
    size: 70 + 100 - 40,
    rotate: -10,
    offsetX: -250,
    offsetY: -100,
    className: "welcome-decor__star--md",
  },
  {
    bottom: "22%",
    right: "11%",
    size: 40 + 50,
    rotate: 18 + 45,
    offsetX: -300,
    offsetY: 0,
    className: "welcome-decor__star--sm",
  },
];

const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  { top: "9%", left: "26%", size: 13, rotate: 28, color: "#8ec8ff" },
  { top: "5%", left: "48%", size: 11, rotate: -20, color: "#a8d8ff" },
  { top: "11%", right: "18%", size: 12, rotate: 35, color: "#7eb6f5" },
  { top: "36%", right: "14%", size: 12, rotate: -28, color: "#9fd0ff" },
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
    ["--decor-x" as string]: `${item.offsetX ?? 0}px`,
    ["--decor-y" as string]: `${item.offsetY ?? 0}px`,
    ["--decor-flip" as string]: item.flipX ? "-1" : "1",
    ...extra,
  };
}

/** Звёзды, серпантины и конфетти — как на главном экране (без цифр, торта и кнопки) */
export function WelcomeFestiveDecor() {
  return (
    <div className="welcome-decor" aria-hidden>
      {DECOR_SPIRALS.map((item, i) => (
        <Image
          key={`spiral-${i}`}
          src="/welcome/spiral.png"
          alt=""
          width={item.size}
          height={item.size}
          className={`welcome-decor__img welcome-decor__spiral ${item.className ?? ""}`}
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
          className={`welcome-decor__img welcome-decor__star ${item.className ?? ""}`}
          style={decorStyle(item, { animationDelay: `${i * 0.35}s` })}
          unoptimized
        />
      ))}

      {DECOR_CONFETTI.map((item, i) => (
        <span
          key={`confetti-${i}`}
          className="welcome-decor__confetti"
          style={decorStyle(item, {
            background: item.color,
            animationDelay: `${i * 0.25}s`,
          })}
        />
      ))}
    </div>
  );
}
