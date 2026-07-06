"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { isValidEmail, isValidFullName } from "@/lib/quiz-config";
import type { AvailabilityResponse, SessionStartResponse } from "@/types/quiz";

/** Стартовый экран — регистрация участника */
export default function StartPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  const isFormValid = isValidFullName(fullName) && isValidEmail(email);

  useEffect(() => {
    fetch("/api/quiz/availability")
      .then((r) => r.json())
      .then(setAvailability);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Ошибка при создании сессии");
        setLoading(false);
        return;
      }

      const session = data as SessionStartResponse;

      sessionStorage.setItem(
        `quiz_${session.sessionId}`,
        JSON.stringify({
          questions: session.questions,
          startedAt: session.startedAt,
          timeLimitMinutes: session.timeLimitMinutes,
        })
      );

      router.push(`/quiz/${session.sessionId}`);
    } catch {
      setError("Не удалось подключиться к серверу");
      setLoading(false);
    }
  };

  return (
    <AppShell centered background="particles" mainClassName="!p-0">
      <div
        className={`register-page-screen register-page-enter w-full${visible ? " register-page-enter--visible" : ""}`}
      >
        <div
          className={`register-card-form register-card-enter quiz-card mx-auto${visible ? " register-card-enter--visible" : ""}`}
        >
          <h1 className="mb-1 text-2xl font-black text-brand-dark sm:text-3xl">
            Регистрация
          </h1>
          <p className="mb-6 text-sm font-medium text-brand-accent md:text-base">
            10 вопросов · 25 минут
          </p>
          <p className="mb-6 text-sm leading-relaxed text-brand-dark/60 md:text-[0.9375rem] lg:mb-8">
            Вопросы показываются по одному, назад вернуться нельзя.
          </p>

          {availability && !availability.available && (
            <div className="mb-4 rounded-xl bg-brand-accent/10 p-3 text-sm text-brand-accent-dark">
              {availability.message}
            </div>
          )}

          <div className="space-y-4 md:space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-brand-dark md:text-[0.9375rem]"
              >
                ФИО
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="quiz-input"
                autoComplete="name"
              />
              {fullName && !isValidFullName(fullName) && (
                <p className="mt-1.5 text-xs text-red-500">
                  Укажите минимум имя и фамилию
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-brand-dark md:text-[0.9375rem]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.ru"
                className="quiz-input"
                autoComplete="email"
              />
              {email && !isValidEmail(email) && (
                <p className="mt-1.5 text-xs text-red-500">
                  Введите корректный email
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 sm:mt-8">
            <Button
              fullWidth
              className="!min-h-[44px] !py-4 !text-base !font-bold"
              onClick={handleStart}
              disabled={
                !isFormValid ||
                loading ||
                (availability !== null && !availability.available)
              }
              loading={loading}
            >
              Начать викторину
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
