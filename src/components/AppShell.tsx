import { BackgroundPattern } from "./BackgroundPattern";
import { Header } from "./Header";
import { QuizFloatingParticles } from "./QuizFloatingParticles";
import { RegisterFloatingParticles } from "./RegisterFloatingParticles";

interface AppShellProps {
  children: React.ReactNode;
  /** Центрировать контент по вертикали (welcome, registration, results) */
  centered?: boolean;
  /** Дополнительный контент под шапкой (прогресс-бар викторины) */
  belowHeader?: React.ReactNode;
  /** Декоративный фон */
  background?: "pattern" | "particles" | "quiz-particles" | "none";
  /** Градиент оболочки */
  gradient?: "default" | "sky";
  /** Декоративный слой под контентом */
  overlay?: React.ReactNode;
  /** Дополнительные классы для main */
  mainClassName?: string;
}

/** Оболочка приложения: градиент, паттерн, шапка */
export function AppShell({
  children,
  centered = false,
  belowHeader,
  background = "pattern",
  gradient = "default",
  overlay,
  mainClassName = "",
}: AppShellProps) {
  const shellClass =
    gradient === "sky" ? "results-sky-gradient" : "app-gradient";

  return (
    <div
      className={`${shellClass} relative flex min-h-dvh min-h-screen flex-col overflow-x-hidden`}
    >
      {overlay}
      {background === "pattern" && <BackgroundPattern />}
      {background === "particles" && <RegisterFloatingParticles />}
      {background === "quiz-particles" && <QuizFloatingParticles />}
      <div className="relative z-10 flex min-h-dvh flex-col">
        <Header />
        {belowHeader}
        <main
          className={
            centered
              ? `flex flex-1 flex-col items-center justify-center px-4 py-6 md:px-8 md:py-10 lg:px-12 lg:py-12 ${mainClassName}`
              : `flex flex-1 flex-col px-4 py-4 pb-8 md:px-8 lg:px-12 lg:pb-10 ${mainClassName}`
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
