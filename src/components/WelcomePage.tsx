"use client";

import Link from "next/link";

/** Заставка — первый экран приложения */
export function WelcomePage() {
  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1 className="welcome-title">ГЕРОФАРМ</h1>
        <p className="welcome-subtitle">25 лет вместе с вами</p>
        <Link href="/quiz" className="welcome-btn">
          Открыть викторину
        </Link>
      </div>

      {/* Мягкий туман снизу */}
      <div className="welcome-fog" aria-hidden />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "120px",
          overflow: "hidden",
          lineHeight: 0,
          zIndex: 5,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        >
          <path
            d="
        M0,120
        L0,90
        Q80,40 160,75
        Q200,90 240,70
        Q290,45 340,65
        Q380,80 420,60
        Q480,30 560,65
        Q600,80 640,60
        Q700,30 780,70
        Q820,85 870,65
        Q930,40 1000,72
        Q1050,88 1100,68
        Q1160,42 1230,75
        Q1300,95 1360,78
        Q1400,65 1440,80
        L1440,120
        Z
      "
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
