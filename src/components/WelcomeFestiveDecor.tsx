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
  mobileHidden?: boolean;
  mobileOnly?: boolean;
  mobileClassName?: string;
};

type ConfettiPos = DecorPos & { color: string };

const DECOR_SPIRALS: DecorPos[] = [
  {
    top: "7%",
    left: "9%",
    size: 42,
    rotate: -18,
    className: "welcome-decor__spiral--sm",
    mobileClassName: "welcome-decor__mobile-spiral-tl",
    mobileHidden: true,
  },
  {
    top: "26%",
    left: "2%",
    size: 168,
    rotate: -38,
    className: "welcome-decor__spiral--lg",
    mobileHidden: true,
  },
  {
    top: "22%",
    right: "6%",
    size: 50,
    rotate: 22,
    className: "welcome-decor__spiral--sm",
    mobileClassName: "welcome-decor__mobile-spiral-tr",
  },
  {
    bottom: "8%",
    right: "2%",
    size: 155,
    rotate: 30,
    offsetX: -100,
    offsetY: -100,
    flipX: true,
    className: "welcome-decor__spiral--lg",
    mobileClassName: "welcome-decor__mobile-spiral-br",
  },
];

const DECOR_STARS: DecorPos[] = [
  {
    bottom: "5%",
    left: "3%",
    size: 168,
    rotate: -8,
    className: "welcome-decor__star--xl",
    mobileClassName: "welcome-decor__mobile-star-bl",
    mobileHidden: true,
  },
  {
    top: "46%",
    left: "9%",
    size: 52,
    rotate: 59,
    offsetX: 200,
    offsetY: 50,
    className: "welcome-decor__star--md",
    mobileHidden: true,
  },
  {
    top: "38%",
    right: "8%",
    size: 130,
    rotate: -10,
    offsetX: -250,
    offsetY: -100,
    className: "welcome-decor__star--md",
    mobileClassName: "welcome-decor__mobile-star-tr",
    mobileHidden: true,
  },
  {
    bottom: "22%",
    right: "11%",
    size: 90,
    rotate: 63,
    offsetX: -300,
    offsetY: 0,
    className: "welcome-decor__star--sm",
    mobileClassName: "welcome-decor__mobile-star-tl",
    mobileHidden: true,
  },
];

const DECOR_CONFETTI: ConfettiPos[] = [
  { top: "9%", left: "26%", size: 13, rotate: 28, color: "#8ec8ff", mobileClassName: "welcome-decor__mobile-confetti-1" },
  { top: "5%", left: "48%", size: 11, rotate: -20, color: "#a8d8ff", mobileClassName: "welcome-decor__mobile-confetti-2" },
  { top: "11%", right: "18%", size: 12, rotate: 35, color: "#7eb6f5", mobileClassName: "welcome-decor__mobile-confetti-3", mobileHidden: true },
  { top: "36%", right: "14%", size: 12, rotate: -28, color: "#9fd0ff", mobileClassName: "welcome-decor__mobile-confetti-4" },
  { top: "18%", left: "8%", size: 14, rotate: 12, color: "#8ec8ff", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-5" },
  { top: "28%", right: "10%", size: 13, rotate: -15, color: "#a8d8ff", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-6", mobileHidden: true },
  { top: "52%", left: "12%", size: 12, rotate: 40, color: "#7eb6f5", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-7" },
  { top: "62%", right: "20%", size: 15, rotate: -8, color: "#9fd0ff", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-8" },
  { bottom: "32%", left: "18%", size: 13, rotate: 25, color: "#8ec8ff", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-9" },
  { bottom: "24%", right: "14%", size: 14, rotate: -22, color: "#a8d8ff", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-10" },
  { bottom: "12%", left: "42%", size: 12, rotate: 18, color: "#7eb6f5", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-11", mobileHidden: true },
  { top: "42%", left: "78%", size: 13, rotate: -30, color: "#9fd0ff", mobileOnly: true, mobileClassName: "welcome-decor__mobile-confetti-12" },
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

function decorClassName(base: string, item: DecorPos): string {
  return [
    base,
    item.className ?? "",
    item.mobileClassName ?? "",
    item.mobileHidden ? "welcome-decor__item--mobile-off" : "",
    item.mobileOnly ? "welcome-decor__item--mobile-only" : "",
  ]
    .filter(Boolean)
    .join(" ");
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
          className={decorClassName(
            "welcome-decor__img welcome-decor__spiral",
            item,
          )}
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
          className={decorClassName(
            "welcome-decor__img welcome-decor__star",
            item,
          )}
          style={decorStyle(item, { animationDelay: `${i * 0.35}s` })}
          unoptimized
        />
      ))}

      {DECOR_CONFETTI.map((item, i) => (
        <span
          key={`confetti-${i}`}
          className={decorClassName("welcome-decor__confetti", item)}
          style={decorStyle(item, {
            background: item.color,
            animationDelay: `${i * 0.25}s`,
          })}
        />
      ))}
    </div>
  );
}
