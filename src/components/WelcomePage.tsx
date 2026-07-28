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
};

/** 4 звезды как на фото 2 */
const DECOR_STARS: DecorPos[] = [
  { bottom: "6%", left: "4%", size: 150, rotate: -10 }, // крупная снизу слева
  { top: "48%", left: "8%", size: 58, rotate: 12 }, // средняя слева ближе к центру
  { top: "40%", right: "7%", size: 64, rotate: -8 }, // средняя справа ближе к центру
  { bottom: "18%", right: "9%", size: 44, rotate: 16 }, // маленькая справа снизу
];

/** 4 спирали как на фото 2 */
const DECOR_SPIRALS: DecorPos[] = [
  { top: "8%", left: "7%", size: 48, rotate: -20 }, // маленькая верх слева
  { top: "30%", left: "3%", size: 145, rotate: -32 }, // крупная слева
  { top: "34%", right: "5%", size: 52, rotate: 18 }, // маленькая справа
  { bottom: "10%", right: "3%", size: 130, rotate: 28 }, // крупная справа снизу
];

/** 4 конфетти-ромбика как на фото 2 */
const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  { top: "10%", left: "28%", size: 14, rotate: 28, color: "#8ec8ff" },
  { top: "36%", left: "14%", size: 12, rotate: -18, color: "#a8d8ff" },
  { bottom: "28%", left: "18%", size: 13, rotate: 40, color: "#7eb6f5" },
  { top: "14%", right: "16%", size: 12, rotate: -24, color: "#9fd0ff" },
];

function decorStyle(item: DecorPos, extra?: CSSProperties): CSSProperties {
  return {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: item.size,
    height: item.size,
    transform: item.rotate != null ? `rotate(${item.rotate}deg)` : undefined,
    ...extra,
  };
}

/** Заставка — праздничный экран к 25-летию */
export function WelcomePage() {
  return (
    <div className="welcome-page">
      <div className="welcome-decor" aria-hidden>
        {DECOR_STARS.map((item, i) => (
          <Image
            key={`star-${i}`}
            src="/welcome/star.png"
            alt=""
            width={item.size}
            height={item.size}
            className="welcome-decor__img welcome-decor__star"
            style={decorStyle(item, { animationDelay: `${i * 0.35}s` })}
            unoptimized
          />
        ))}

        {DECOR_SPIRALS.map((item, i) => (
          <Image
            key={`spiral-${i}`}
            src="/welcome/spiral.png"
            alt=""
            width={item.size}
            height={item.size}
            className="welcome-decor__img welcome-decor__spiral"
            style={decorStyle(item, { animationDelay: `${i * 0.45}s` })}
            unoptimized
          />
        ))}

        {DECOR_CONFETTI.map((item, i) => (
          <span
            key={`confetti-${i}`}
            className="welcome-decor__confetti"
            style={decorStyle(item, {
              background: item.color,
              animationDelay: `${i * 0.3}s`,
            })}
          />
        ))}
      </div>

      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="welcome-balloons">
            <Image
              src="/welcome/balloon-2.png"
              alt="2"
              width={320}
              height={400}
              className="welcome-balloon welcome-balloon--2"
              priority
              unoptimized
            />
            <Image
              src="/welcome/balloon-5.png"
              alt="5"
              width={320}
              height={400}
              className="welcome-balloon welcome-balloon--5"
              priority
              unoptimized
            />
          </div>

          <Image
            src="/welcome/cake.png"
            alt=""
            width={240}
            height={240}
            className="welcome-cake"
            priority
            unoptimized
          />
        </div>

        <h1 className="welcome-title">ГЕРОФАРМ</h1>
        <p className="welcome-subtitle">25 лет вместе с вами</p>

        <Link href="/quiz" className="welcome-btn">
          открыть викторину
        </Link>
      </div>
    </div>
  );
}
