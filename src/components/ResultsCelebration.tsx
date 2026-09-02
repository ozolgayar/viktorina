"use client";

import Link from "next/link";
import { WelcomeFestiveDecor } from "@/components/WelcomeFestiveDecor";

const STARS = [
  { top: "-8px", left: "20px", symbol: "✦", color: "#F7941D", delay: 0 },
  { top: "-4px", right: "24px", symbol: "⭐", color: "#facc15", delay: 0.3 },
  { top: "28px", left: "-12px", symbol: "★", color: "#2dd4bf", delay: 0.6 },
  { top: "32px", right: "-10px", symbol: "✦", color: "#F7941D", delay: 0.9 },
  { bottom: "8px", left: "16px", symbol: "⭐", color: "#facc15", delay: 1.2 },
  { bottom: "4px", right: "20px", symbol: "★", color: "#2dd4bf", delay: 1.5 },
] as const;

/** Праздничный фон экрана победы — декор как на главной */
export function ResultsFestiveBackground() {
  return (
    <div className="results-festive-bg" aria-hidden>
      <WelcomeFestiveDecor />
    </div>
  );
}

interface PerfectResultCardProps {
  score: number;
  totalQuestions: number;
}

/** Карточка победы */
export function PerfectResultCard({
  score,
  totalQuestions,
}: PerfectResultCardProps) {
  return (
    <div className="results-celebration-card">
      <div className="results-trophy-wrap">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="results-trophy-star"
            style={{
              top: star.top,
              left: star.left,
              right: star.right,
              bottom: star.bottom,
              color: star.color,
              animationDelay: `${star.delay}s`,
            }}
            aria-hidden
          >
            {star.symbol}
          </span>
        ))}
        <span className="results-trophy-icon" aria-hidden>
          🏆
        </span>
      </div>

      <h1 className="results-celebration-title">Отличный результат!</h1>
      <p className="results-celebration-subtitle">
        Мало кто знает компанию лучше вас. Спасибо за ваши амбициозные цели,
        страстную работу и ответственный подход!
      </p>

      <div className="results-score-badge">
        <span className="results-score-badge__label">Ваш результат:</span>
        <span className="results-score-badge__value">
          {score}/{totalQuestions}
        </span>
      </div>

      <p className="results-celebration-text">
        Списки победителей будут опубликованы после 15 сентября. Организаторы
        свяжутся и расскажут, как получить подарок. Напоминаем, что сотрудник
        может получить только 1 подарок, вне зависимости от количества
        выигранных викторин.
      </p>

      <Link href="/" className="results-home-btn">
        На главную
      </Link>
    </div>
  );
}
