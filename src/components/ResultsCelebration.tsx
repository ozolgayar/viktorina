const COLORS = [
  "#F7941D",
  "#2dd4bf",
  "#f472b6",
  "#facc15",
  "#a78bfa",
  "#34d399",
  "#f87171",
] as const;

const CLOUDS = [
  { top: "8%", left: "4%", scale: 1.4, duration: 9 },
  { top: "10%", left: "52%", scale: 1.0, duration: 12 },
  { top: "5%", right: "6%", scale: 0.75, duration: 8 },
  { top: "22%", left: "25%", scale: 1.15, duration: 14 },
] as const;

const STARS = [
  { top: "-8px", left: "20px", symbol: "✦", color: "#F7941D", delay: 0 },
  { top: "-4px", right: "24px", symbol: "⭐", color: "#facc15", delay: 0.3 },
  { top: "28px", left: "-12px", symbol: "★", color: "#2dd4bf", delay: 0.6 },
  { top: "32px", right: "-10px", symbol: "✦", color: "#F7941D", delay: 0.9 },
  { bottom: "8px", left: "16px", symbol: "⭐", color: "#facc15", delay: 1.2 },
  { bottom: "4px", right: "20px", symbol: "★", color: "#2dd4bf", delay: 1.5 },
] as const;

function buildConfetti() {
  const items = [];

  for (let i = 0; i < 40; i++) {
    const elongated = i % 5 === 0;
    const circle = i % 3 === 1;
    const sway = i % 2 === 1;

    items.push({
      left: `${(i * 17 + 3) % 100}%`,
      top: `${(i * 23 + 7) % 100}%`,
      color: COLORS[i % COLORS.length],
      width: elongated ? 10 : 6 + (i % 7),
      height: elongated ? 4 : 6 + ((i + 2) % 7),
      borderRadius: circle ? "50%" : "2px",
      duration: 3 + (i % 5),
      delay: -5 + ((i * 0.42) % 7),
      animation: sway ? "results-confetti-sway" : "results-confetti-fall",
    });
  }

  return items;
}

const CONFETTI = buildConfetti();

function ResultsCloud({
  top,
  left,
  right,
  scale,
  duration,
}: {
  top: string;
  left?: string;
  right?: string;
  scale: number;
  duration: number;
}) {
  return (
    <div
      className="results-cloud"
      style={{
        top,
        left,
        right,
        ["--cloud-scale" as string]: scale,
        animationDuration: `${duration}s`,
      }}
      aria-hidden
    >
      <div className="results-cloud__base" />
      <div className="results-cloud__hump results-cloud__hump--left" />
      <div className="results-cloud__hump results-cloud__hump--center" />
      <div className="results-cloud__hump results-cloud__hump--right" />
      <div className="results-cloud__hump results-cloud__hump--small" />
    </div>
  );
}

/** Праздничный фон: конфетти и облака */
export function ResultsFestiveBackground() {
  return (
    <div className="results-festive-bg" aria-hidden>
      {CONFETTI.map((item, i) => (
        <span
          key={i}
          className="results-confetti"
          style={{
            left: item.left,
            top: item.top,
            width: `${item.width}px`,
            height: `${item.height}px`,
            borderRadius: item.borderRadius,
            backgroundColor: item.color,
            animationName: item.animation,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
          }}
        />
      ))}

      {CLOUDS.map((cloud, i) => (
        <ResultsCloud key={i} {...cloud} />
      ))}
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

      <h1 className="results-celebration-title">Вы выиграли!</h1>
      <p className="results-celebration-subtitle">
        Вы настоящий эксперт «ГЕРОФАРМ»!
      </p>

      <div className="results-score-badge">
        <span className="results-score-badge__label">Ваш результат:</span>
        <span className="results-score-badge__value">
          {score} из {totalQuestions}
        </span>
      </div>

      <p className="results-celebration-text">
        Спасибо за участие! Ваш результат зафиксирован. Организаторы свяжутся
        с победителями по указанному email.
      </p>

      <a href="/" className="results-home-btn">
        На главную
      </a>
    </div>
  );
}
