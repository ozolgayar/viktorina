import { Logo } from "./Logo";

/** Единая шапка на всех страницах */
export function Header() {
  return (
    <header className="app-header sticky top-0 z-20 flex w-full shrink-0 items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
      <Logo light />
      <p className="header-quiz-title pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-sm font-medium xs:block sm:text-base">
        Корпоративная викторина
      </p>
    </header>
  );
}
