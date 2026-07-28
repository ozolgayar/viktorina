"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { BackgroundPattern } from "./BackgroundPattern";

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

/** Декор вокруг центрального контента (без шариков и торта) */
const DECOR_SPIRALS: DecorPos[] = [
  { top: "12%", left: "6%", size: 48, rotate: -18, className: "welcome-decor__spiral--sm" },
  { top: "18%", right: "7%", size: 56, rotate: 22, className: "welcome-decor__spiral--sm" },
  {
    bottom: "14%",
    left: "4%",
    size: 120,
    rotate: -28,
    className: "welcome-decor__spiral--lg",
  },
  {
    bottom: "10%",
    right: "3%",
    size: 130,
    rotate: 26,
    flipX: true,
    className: "welcome-decor__spiral--lg",
  },
];

const DECOR_STARS: DecorPos[] = [
  { top: "22%", left: "10%", size: 58, rotate: -12, className: "welcome-decor__star--md" },
  { top: "28%", right: "9%", size: 72, rotate: 14, className: "welcome-decor__star--md" },
  { bottom: "22%", left: "8%", size: 140, rotate: -8, className: "welcome-decor__star--xl" },
  { bottom: "18%", right: "10%", size: 48, rotate: 28, className: "welcome-decor__star--sm" },
];

const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  { top: "16%", left: "22%", size: 12, rotate: 28, color: "#8ec8ff" },
  { top: "14%", right: "24%", size: 11, rotate: -20, color: "#a8d8ff" },
  { bottom: "28%", left: "18%", size: 12, rotate: 35, color: "#7eb6f5" },
  { bottom: "32%", right: "16%", size: 12, rotate: -28, color: "#9fd0ff" },
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

/** Заставка — праздничный экран к 25-летию */
export function WelcomePage() {
  return (
    <div className="welcome-page">
      <BackgroundPattern />

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

      <div className="welcome-stack">
        <div className="welcome-copy">
          <h1 className="welcome-title">ГЕРОФАРМ</h1>
          <Link href="/quiz" className="welcome-btn">
            Открыть викторину
          </Link>
        </div>
      </div>
    </div>
  );
}
