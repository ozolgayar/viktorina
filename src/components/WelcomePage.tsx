"use client";

import Image from "next/image";
import Link from "next/link";

/** Декор как на референсе: только звёзды и спиральки */
const DECOR_STARS = [
  { top: "38%", left: "7%", size: 42, rotate: -12 },
  { top: "36%", right: "8%", size: 58, rotate: 14 },
  { bottom: "10%", left: "5%", size: 110, rotate: -8 },
  { bottom: "16%", right: "10%", size: 52, rotate: 18 },
] as const;

const DECOR_SPIRALS = [
  { top: "28%", left: "4%", size: 120, rotate: -28 },
  { top: "42%", right: "3%", size: 105, rotate: 22 },
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
              top: item.top,
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
      </div>

      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="welcome-balloons">
            <Image
              src="/welcome/balloon-2.png"
              alt="2"
              width={280}
              height={340}
              className="welcome-balloon welcome-balloon--2"
              priority
              unoptimized
            />
            <Image
              src="/welcome/balloon-5.png"
              alt="5"
              width={280}
              height={340}
              className="welcome-balloon welcome-balloon--5"
              priority
              unoptimized
            />
          </div>

          <Image
            src="/welcome/cake.png"
            alt=""
            width={180}
            height={180}
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
