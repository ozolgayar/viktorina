"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

type DecorPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate?: number;
  className?: string;
};

/**
 * Декор строго по фото 2:
 * 4 серпантина, 4 звезды, 4 конфетти.
 */
const DECOR_SPIRALS: DecorPos[] = [
  { top: "7%", left: "9%", size: 42, rotate: -18, className: "welcome-decor__spiral--sm" },
  { top: "26%", left: "2%", size: 168, rotate: -38, className: "welcome-decor__spiral--lg" },
  { top: "22%", right: "6%", size: 50, rotate: 22, className: "welcome-decor__spiral--sm" },
  { bottom: "8%", right: "2%", size: 155, rotate: 30, className: "welcome-decor__spiral--lg" },
];

const DECOR_STARS: DecorPos[] = [
  { bottom: "5%", left: "3%", size: 168, rotate: -8, className: "welcome-decor__star--xl" },
  { top: "46%", left: "9%", size: 52, rotate: 14, className: "welcome-decor__star--md" },
  { top: "38%", right: "8%", size: 70, rotate: -10, className: "welcome-decor__star--md" },
  { bottom: "22%", right: "11%", size: 40, rotate: 18, className: "welcome-decor__star--sm" },
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
    ["--decor-rotate" as string]: item.rotate != null ? `${item.rotate}deg` : "0deg",
    ...extra,
  };
}

/** Заставка — праздничный экран к 25-летию (композиция как на фото 2) */
export function WelcomePage() {
  return (
    <div className="welcome-page">
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
        <div className="welcome-hero">
          <div className="welcome-balloons" aria-hidden={false}>
            <Image
              src="/welcome/balloon-2.png"
              alt="2"
              width={360}
              height={440}
              className="welcome-balloon welcome-balloon--2"
              priority
              unoptimized
            />
            <Image
              src="/welcome/balloon-5.png"
              alt="5"
              width={360}
              height={440}
              className="welcome-balloon welcome-balloon--5"
              priority
              unoptimized
            />
          </div>

          <div className="welcome-cake-wrap">
            <Image
              src="/welcome/cake.png"
              alt=""
              width={280}
              height={280}
              className="welcome-cake"
              priority
              unoptimized
            />
          </div>
        </div>

        <div className="welcome-copy">
          <h1 className="welcome-title">ГЕРОФАРМ</h1>
          <p className="welcome-subtitle">25 лет вместе с вами</p>
          <Link href="/quiz" className="welcome-btn">
            открыть викторину
          </Link>
        </div>
      </div>
    </div>
  );
}
