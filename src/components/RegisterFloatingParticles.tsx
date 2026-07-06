const PARTICLES = [
  { icon: "?", left: "10%", top: "10%", fontSize: 28, duration: 8, delay: 0 },
  { icon: "✦", left: "20%", top: "60%", fontSize: 22, duration: 11, delay: 0.5 },
  { icon: "◆", left: "75%", top: "15%", fontSize: 32, duration: 14, delay: 1 },
  { icon: "?", left: "85%", top: "70%", fontSize: 18, duration: 9, delay: 1.5 },
  { icon: "✦", left: "15%", top: "85%", fontSize: 26, duration: 12, delay: 2 },
  { icon: "◆", left: "65%", top: "25%", fontSize: 20, duration: 10, delay: 2.5 },
  { icon: "?", left: "40%", top: "50%", fontSize: 30, duration: 13, delay: 3 },
  { icon: "✦", left: "90%", top: "40%", fontSize: 24, duration: 8, delay: 3.5 },
  { icon: "◆", left: "5%", top: "35%", fontSize: 19, duration: 11, delay: 4 },
  { icon: "?", left: "55%", top: "80%", fontSize: 31, duration: 14, delay: 4.5 },
  { icon: "✦", left: "30%", top: "20%", fontSize: 21, duration: 9, delay: 5 },
  { icon: "◆", left: "80%", top: "55%", fontSize: 27, duration: 12, delay: 2.2 },
] as const;

/** Плавающие частицы на фоне страницы регистрации */
export function RegisterFloatingParticles() {
  return (
    <div className="register-particles" aria-hidden>
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className={`register-particle${index >= 7 ? " register-particle--desktop-only" : ""}`}
          style={{
            left: particle.left,
            top: particle.top,
            ["--particle-size" as string]: `${particle.fontSize}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.icon}
        </span>
      ))}
    </div>
  );
}
