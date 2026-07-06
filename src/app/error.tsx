"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Страница ошибки — вместо пустого «500 Internal Server Error» */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="app-gradient flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="quiz-card max-w-md text-center">
        <h1 className="mb-2 text-2xl font-bold text-brand-dark">
          Что-то пошло не так
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-brand-dark/60">
          Попробуйте обновить страницу. Если ошибка повторяется — перезапустите
          сервер командой{" "}
          <code className="rounded bg-brand-light px-1.5 py-0.5 text-brand-primary">
            npm run dev
          </code>
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={reset} className="btn-primary w-full">
            Попробовать снова
          </button>
          <Link
            href="/"
            className="rounded-xl border-2 border-brand-primary py-3 text-center text-sm font-semibold text-brand-primary"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
