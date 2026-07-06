const ICONS = ["?", "✦", "◆", "📝", "💡", "⭐", "✓", "?"] as const;

const PARTICLES = [
  { left: "8%", top: "12%", fontSize: 24, duration: 8, delay: 0 },
  { left: "22%", top: "68%", fontSize: 18, duration: 11, delay: 0.46 },
  { left: "78%", top: "18%", fontSize: 28, duration: 14, delay: 0.92 },
  { left: "88%", top: "72%", fontSize: 20, duration: 9, delay: 1.38 },
  { left: "12%", top: "88%", fontSize: 26, duration: 12, delay: 1.85 },
  { left: "62%", top: "28%", fontSize: 16, duration: 10, delay: 2.31 },
  { left: "42%", top: "48%", fontSize: 22, duration: 13, delay: 2.77 },
  { left: "92%", top: "42%", fontSize: 19, delay: 3.23, duration: 8 },
  { left: "4%", top: "38%", fontSize: 27, duration: 11, delay: 3.69 },
  { left: "52%", top: "82%", fontSize: 21, duration: 14, delay: 4.15 },
  { left: "28%", top: "22%", fontSize: 17, duration: 9, delay: 4.62 },
  { left: "72%", top: "58%", fontSize: 25, duration: 12, delay: 5.08 },
  { left: "35%", top: "75%", fontSize: 23, duration: 10, delay: 5.54 },
  { left: "58%", top: "8%", fontSize: 16, duration: 13, delay: 6 },
] as const;

/** Плавающие частицы на фоне страницы викторины */
export function QuizFloatingParticles() {
  return (
    <div className="quiz-floating-particles" aria-hidden>
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className={`quiz-floating-particle${index >= 7 ? " quiz-floating-particle--desktop-only" : ""}`}
          style={{
            left: particle.left,
            top: particle.top,
            ["--particle-size" as string]: `${particle.fontSize}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {ICONS[index % ICONS.length]}
        </span>
      ))}
    </div>
  );
}
