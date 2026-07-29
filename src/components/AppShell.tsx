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
  /** Контент по центру шапки (например, таймер) */
  headerCenter?: React.ReactNode;
  /** Скрыть шапку (например, на экране результатов) */
  hideHeader?: boolean;
  /** Декоративный фон */
  background?: "pattern" | "particles" | "quiz-particles" | "none";
  /** Градиент оболочки */
  gradient?: "default" | "sky" | "festive";
  /** Декоративный слой под контентом */
  overlay?: React.ReactNode;
  /** Дополнительные классы для main */
  mainClassName?: string;
  /** Дополнительные классы для корневой оболочки */
  shellClassName?: string;
  /** Зафиксировать высоту во viewport без скролла страницы */
  lockViewport?: boolean;
}

/** Оболочка приложения: градиент, паттерн, шапка */
export function AppShell({
  children,
  centered = false,
  belowHeader,
  headerCenter,
  hideHeader = false,
  background = "none",
  gradient = "festive",
  overlay,
  mainClassName = "",
  shellClassName = "",
  lockViewport = false,
}: AppShellProps) {
  const shellClass =
    gradient === "sky"
      ? "results-sky-gradient"
      : gradient === "festive"
        ? "app-gradient--festive"
        : "app-gradient";

  return (
    <div
      className={[
        shellClass,
        "relative flex flex-col overflow-x-hidden",
        lockViewport ? "app-shell--locked" : "min-h-dvh min-h-screen",
        shellClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {overlay}
      {background === "pattern" && <BackgroundPattern />}
      {background === "particles" && <RegisterFloatingParticles />}
      {background === "quiz-particles" && <QuizFloatingParticles />}
      <div
        className={[
          "app-shell__body relative z-10 flex flex-col",
          lockViewport ? "h-full min-h-0 overflow-hidden" : "min-h-dvh",
        ].join(" ")}
      >
        {!hideHeader && <Header center={headerCenter} />}
        {belowHeader}
        <main
          className={
            centered
              ? `flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 md:px-8 md:py-10 lg:px-12 lg:py-12 ${
                  lockViewport ? "overflow-hidden" : ""
                } ${mainClassName}`
              : `flex min-h-0 flex-1 flex-col px-4 py-4 pb-8 md:px-8 lg:px-12 lg:pb-10 ${
                  lockViewport ? "overflow-hidden" : ""
                } ${mainClassName}`
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
