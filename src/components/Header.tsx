import { Logo } from "./Logo";

interface HeaderProps {
  /** Контент по центру шапки (например, таймер). Если задан — заменяет заголовок */
  center?: React.ReactNode;
}

/** Единая шапка на всех страницах */
export function Header({ center }: HeaderProps) {
  return (
    <header className="app-header app-header--stacked relative z-20 flex w-full shrink-0 flex-col gap-1 px-4 py-2 md:flex-row md:items-center md:justify-between md:gap-0 md:px-8 md:py-3">
      <Logo light />
      <div className="flex justify-center md:pointer-events-none md:absolute md:left-1/2 md:-translate-x-1/2">
        {center ?? (
          <p className="header-quiz-title text-xs font-medium leading-tight md:text-base">
            Корпоративная викторина
          </p>
        )}
      </div>
    </header>
  );
}
