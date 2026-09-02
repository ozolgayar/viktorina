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
  mobileClassName?: string;
};

const DECOR_SPIRALS: DecorPos[] = [
  {
    top: "7%",
    left: "9%",
    size: 42,
    rotate: -18,
    className: "welcome-decor__spiral--sm",
    mobileClassName: "welcome-decor__mobile-tl",
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
    mobileClassName: "welcome-decor__mobile-tr",
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
    mobileClassName: "welcome-decor__mobile-br",
  },
];

const DECOR_STARS: DecorPos[] = [
  {
    bottom: "5%",
    left: "3%",
    size: 168,
    rotate: -8,
    className: "welcome-decor__star--xl",
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
    mobileClassName: "welcome-decor__mobile-tr-star",
  },
  {
    bottom: "22%",
    right: "11%",
    size: 90,
    rotate: 63,
    offsetX: -300,
    offsetY: 0,
    className: "welcome-decor__star--sm",
    mobileClassName: "welcome-decor__mobile-br-star",
  },
];

const DECOR_CONFETTI: (DecorPos & { color: string })[] = [
  {
    top: "9%",
    left: "26%",
    size: 13,
    rotate: 28,
    color: "#8ec8ff",
    mobileClassName: "welcome-decor__mobile-confetti-tl",
  },
  {
    top: "5%",
    left: "48%",
    size: 11,
    rotate: -20,
    color: "#a8d8ff",
    mobileHidden: true,
  },
  {
    top: "11%",
    right: "18%",
    size: 12,
    rotate: 35,
    color: "#7eb6f5",
    mobileClassName: "welcome-decor__mobile-confetti-tr",
  },
  {
    top: "36%",
    right: "14%",
    size: 12,
    rotate: -28,
    color: "#9fd0ff",
    mobileHidden: true,
  },
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
