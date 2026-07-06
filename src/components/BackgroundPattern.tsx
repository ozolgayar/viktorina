/** Аккуратный геометрический паттерн — концентрические окружности в углах */
export function BackgroundPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Левый верхний угол */}
      <circle
        className="bg-pattern-circle bg-pattern-circle--1"
        cx="10%"
        cy="15%"
        r="300"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <circle
        className="bg-pattern-circle bg-pattern-circle--2"
        cx="10%"
        cy="15%"
        r="200"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <circle
        className="bg-pattern-circle bg-pattern-circle--3"
        cx="10%"
        cy="15%"
        r="100"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* Правый нижний угол */}
      <circle
        className="bg-pattern-circle bg-pattern-circle--4"
        cx="90%"
        cy="85%"
        r="400"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <circle
        className="bg-pattern-circle bg-pattern-circle--5"
        cx="90%"
        cy="85%"
        r="280"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <circle
        className="bg-pattern-circle bg-pattern-circle--6"
        cx="90%"
        cy="85%"
        r="160"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
    </svg>
  );
}
