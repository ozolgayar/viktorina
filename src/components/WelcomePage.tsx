"use client";

import Image from "next/image";
import Link from "next/link";

const DECOR_STARS = [
  { top: "6%", left: "8%", size: 56, rotate: -18 },
  { top: "18%", right: "6%", size: 72, rotate: 12 },
  { bottom: "22%", left: "10%", size: 48, rotate: 28 },
  { bottom: "14%", right: "12%", size: 64, rotate: -8 },
] as const;

const DECOR_SPIRALS = [
  { top: "10%", left: "18%", size: 70, rotate: -35 },
  { top: "28%", right: "14%", size: 90, rotate: 20 },
  { bottom: "28%", left: "6%", size: 60, rotate: 45 },
  { bottom: "18%", right: "22%", size: 78, rotate: -15 },
] as const;

const DECOR_SQUARES = [
  { top: "12%", left: "28%", size: 14, rotate: 18, color: "#8ec8ff" },
  { top: "22%", right: "24%", size: 12, rotate: -22, color: "#a8d8ff" },
  { top: "42%", left: "8%", size: 16, rotate: 35, color: "#7eb6f5" },
  { bottom: "30%", right: "8%", size: 13, rotate: -12, color: "#9fd0ff" },
  { bottom: "38%", left: "22%", size: 11, rotate: 48, color: "#b8e0ff" },
  { top: "55%", right: "18%", size: 15, rotate: -30, color: "#86c2f8" },
] as const;

const DECOR_SQUIGGLES = [
  { top: "16%", left: "42%" },
  { top: "36%", right: "28%" },
  { bottom: "34%", left: "30%" },
  { bottom: "24%", right: "36%" },
] as const;

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
            style={{
              top: "top" in item ? item.top : undefined,
              bottom: "bottom" in item ? item.bottom : undefined,
              left: "left" in item ? item.left : undefined,
              right: "right" in item ? item.right : undefined,
              width: item.size,
              height: item.size,
              transform: `rotate(${item.rotate}deg)`,
              animationDelay: `${i * 0.4}s`,
            }}
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
            style={{
              top: "top" in item ? item.top : undefined,
              bottom: "bottom" in item ? item.bottom : undefined,
              left: "left" in item ? item.left : undefined,
              right: "right" in item ? item.right : undefined,
              width: item.size,
              height: item.size,
              transform: `rotate(${item.rotate}deg)`,
              animationDelay: `${i * 0.55}s`,
            }}
            unoptimized
          />
        ))}

        {DECOR_SQUARES.map((item, i) => (
          <span
            key={`sq-${i}`}
            className="welcome-decor__square"
            style={{
              top: "top" in item ? item.top : undefined,
              bottom: "bottom" in item ? item.bottom : undefined,
              left: "left" in item ? item.left : undefined,
              right: "right" in item ? item.right : undefined,
              width: item.size,
              height: item.size,
              background: item.color,
              transform: `rotate(${item.rotate}deg)`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}

        {DECOR_SQUIGGLES.map((item, i) => (
          <span
            key={`sqg-${i}`}
            className="welcome-decor__squiggle"
            style={{
              top: "top" in item ? item.top : undefined,
              bottom: "bottom" in item ? item.bottom : undefined,
              left: "left" in item ? item.left : undefined,
              right: "right" in item ? item.right : undefined,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="welcome-balloons">
            <Image
              src="/welcome/balloon-2.png"
              alt="2"
              width={180}
              height={220}
              className="welcome-balloon welcome-balloon--2"
              priority
              unoptimized
            />
            <Image
              src="/welcome/balloon-5.png"
              alt="5"
              width={180}
              height={220}
              className="welcome-balloon welcome-balloon--5"
              priority
              unoptimized
            />
          </div>

          <Image
            src="/welcome/cake.png"
            alt=""
            width={220}
            height={220}
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
