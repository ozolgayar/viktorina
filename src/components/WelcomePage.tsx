"use client";

import Image from "next/image";
import Link from "next/link";

/** Воздушное облако — круги с перекрытием, масштабируются под размер контейнера */
type AiryPart = {
  w: number | string;
  h: number;
  bottom: number;
  left: number | string;
  blur: number;
  bg: string;
  glow: boolean;
};

const AIRY_CLOUD_BASE_W = 180;
const AIRY_CLOUD_BASE_H = 65;

const AIRY_CLOUD_TEMPLATE: AiryPart[] = [
  { w: 100, h: 65, bottom: 0, left: 30, blur: 0.3, bg: "white", glow: true },
  { w: 75, h: 55, bottom: 0, left: 5, blur: 0.4, bg: "white", glow: true },
  { w: 80, h: 58, bottom: 0, left: 90, blur: 0.3, bg: "white", glow: true },
  { w: 70, h: 60, bottom: 18, left: 50, blur: 0.5, bg: "white", glow: true },
  { w: 55, h: 48, bottom: 12, left: 20, blur: 0.6, bg: "white", glow: true },
  { w: 58, h: 50, bottom: 15, left: 85, blur: 0.5, bg: "white", glow: true },
  { w: 35, h: 32, bottom: 30, left: 40, blur: 0.8, bg: "rgba(255,255,255,0.95)", glow: true },
  { w: 30, h: 28, bottom: 28, left: 75, blur: 0.9, bg: "rgba(255,255,255,0.92)", glow: true },
  { w: "80%", h: 8, bottom: -3, left: "10%", blur: 4, bg: "rgba(180,210,230,0.25)", glow: false },
];

function buildAiryCloudParts(width: number, height: number): AiryPart[] {
  const sx = width / AIRY_CLOUD_BASE_W;
  const sy = height / AIRY_CLOUD_BASE_H;

  return AIRY_CLOUD_TEMPLATE.map((part) => ({
    ...part,
    w: typeof part.w === "string" ? part.w : Math.round(part.w * sx),
    h: Math.round(part.h * sy),
    bottom: Math.round(part.bottom * sy),
    left:
      typeof part.left === "string" ? part.left : Math.round(part.left * sx),
  }));
}

function DriftingCloud({
  className,
  style,
  width,
  height,
}: {
  className: string;
  style: React.CSSProperties;
  width: number;
  height: number;
}) {
  const parts = buildAiryCloudParts(width, height);

  return (
    <div
      className={`welcome-drift-cloud ${className}`}
      style={style}
      aria-hidden
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className="welcome-drift-cloud__part"
          style={{
            width: part.w,
            height: part.h,
            bottom: part.bottom,
            left: part.left,
            background: part.bg,
            filter: `blur(${part.blur}px)`,
            boxShadow: part.glow
              ? "0 2px 8px rgba(255,255,255,0.8)"
              : undefined,
          }}
        />
      ))}
    </div>
  );
}

/** Волнистая верёвочка SVG */
function BalloonString({ flip = false }: { flip?: boolean }) {
  const d = flip
    ? "M12 1 C7 16, 17 32, 12 50"
    : "M12 1 C17 16, 7 32, 12 50";

  return (
    <svg
      className="welcome-balloon-string-svg"
      width="24"
      height="50"
      viewBox="0 0 24 52"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke="rgba(80, 80, 80, 0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Цвета конфетти */
const CONFETTI_COLORS = [
  "#00A88E",
  "#F5821F",
  "#FFD700",
  "#FF6B6B",
  "#9B59B6",
  "#3498DB",
  "#FF69B4",
];

type ConfettiType = "rect" | "square" | "circle";

/** 25 конфетти: 10 прямоугольников, 8 квадратов, 7 кругов */
function buildConfetti() {
  const items: {
    type: ConfettiType;
    left: string;
    color: string;
    duration: number;
    delay: number;
  }[] = [];

  for (let i = 0; i < 10; i++) {
    items.push({
      type: "rect",
      left: `${2 + ((i * 11 + 3) % 96)}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      duration: 5 + (i % 5),
      delay: -8 + (i * 0.75) % 8,
    });
  }
  for (let i = 0; i < 8; i++) {
    items.push({
      type: "square",
      left: `${4 + ((i * 13 + 7) % 94)}%`,
      color: CONFETTI_COLORS[(i + 2) % CONFETTI_COLORS.length],
      duration: 5.5 + (i % 4),
      delay: -7 + (i * 0.9) % 7,
    });
  }
  for (let i = 0; i < 7; i++) {
    items.push({
      type: "circle",
      left: `${6 + ((i * 15 + 1) % 92)}%`,
      color: CONFETTI_COLORS[(i + 4) % CONFETTI_COLORS.length],
      duration: 6 + (i % 4),
      delay: -6 + (i * 1.1) % 6,
    });
  }

  return items;
}

const CONFETTI = buildConfetti();

function ConfettiPiece({
  item,
}: {
  item: (typeof CONFETTI)[number];
}) {
  return (
    <span
      className={`welcome-confetti welcome-confetti--${item.type}`}
      style={{
        left: item.left,
        backgroundColor: item.color,
        animationDuration: `${item.duration}s`,
        animationDelay: `${item.delay}s`,
      }}
      aria-hidden
    />
  );
}

/** Искры вокруг шариков «25» */
const SPARKS = [
  { top: "-15px", left: "10%", color: "#FFD700", size: 18, delay: 0, duration: 1.8 },
  { top: "-5px", right: "8%", color: "#FFFFFF", size: 14, delay: 0.3, duration: 2 },
  { top: "30%", left: "-20px", color: "#FFD700", size: 22, delay: 0.6, duration: 2.2 },
  { top: "25%", right: "-18px", color: "#FFFFFF", size: 16, delay: 0.9, duration: 1.9 },
  { bottom: "15px", left: "15%", color: "#FFD700", size: 14, delay: 1.2, duration: 2.5 },
  { bottom: "20px", right: "12%", color: "#FFFFFF", size: 20, delay: 1.5, duration: 2.1 },
];

/** Заставка — первый экран приложения */
export function WelcomePage() {
  return (
    <div className="welcome-page">
      {/* Плывущие облака */}
      <DriftingCloud
        className="welcome-drift-cloud--1"
        style={{ top: "8%", left: "-180px", width: 200, height: 70 }}
        width={200}
        height={70}
      />
      <DriftingCloud
        className="welcome-drift-cloud--2"
        style={{ top: "14%", right: "-150px", width: 170, height: 60 }}
        width={170}
        height={60}
      />
      <DriftingCloud
        className="welcome-drift-cloud--3"
        style={{ top: "4%", left: "-120px", width: 140, height: 50 }}
        width={140}
        height={50}
      />
      <DriftingCloud
        className="welcome-drift-cloud--4"
        style={{ top: "25%", right: "-160px", width: 160, height: 58 }}
        width={160}
        height={58}
      />

      {/* Конфетти */}
      {CONFETTI.map((c, i) => (
        <ConfettiPiece key={i} item={c} />
      ))}

      {/* Контент */}
      <div className="welcome-content">
        <div className="welcome-balloons welcome-enter-balloons">
          {/* Искры вокруг шариков */}
          {SPARKS.map((s, i) => (
            <span
              key={i}
              className="welcome-spark"
              style={{
                top: s.top,
                left: s.left,
                right: s.right,
                bottom: s.bottom,
                color: s.color,
                fontSize: s.size,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
              aria-hidden
            >
              ✦
            </span>
          ))}

          <div className="welcome-balloon-wrap welcome-balloon-wrap--2">
            <div className="welcome-balloon-unit">
              <div className="welcome-balloon-float1">
                <Image
                  src="/balloons/balloon-2.png"
                  alt="Шарик 2"
                  width={160}
                  height={220}
                  className="welcome-balloon-img"
                  priority
                />
                <BalloonString />
              </div>
              <div className="welcome-balloon-shadow" />
            </div>
          </div>
          <div className="welcome-balloon-wrap welcome-balloon-wrap--5">
            <div className="welcome-balloon-unit">
              <div className="welcome-balloon-float2">
                <Image
                  src="/balloons/balloon-5.png"
                  alt="Шарик 5"
                  width={160}
                  height={220}
                  className="welcome-balloon-img"
                  priority
                />
                <BalloonString flip />
              </div>
              <div className="welcome-balloon-shadow" />
            </div>
          </div>
        </div>

        <h1 className="welcome-title welcome-enter-title">ГЕРОФАРМ</h1>
        <p className="welcome-subtitle welcome-enter-subtitle">
          25 лет вместе с вами
        </p>

        <Link href="/quiz" className="welcome-btn welcome-enter-btn">
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
