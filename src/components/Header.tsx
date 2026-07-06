import { Logo } from "./Logo";

/** Единая шапка на всех страницах */
export function Header() {
  return (
    <header className="app-header app-header--stacked sticky top-0 z-20 flex w-full shrink-0 flex-col gap-1 px-4 py-2 md:flex-row md:items-center md:justify-between md:gap-0 md:px-8 md:py-4">
      <Logo light />
      <p className="header-quiz-title text-xs font-medium leading-tight md:pointer-events-none md:absolute md:left-1/2 md:-translate-x-1/2 md:text-base">
        Корпоративная викторина
      </p>
    </header>
  );
}
