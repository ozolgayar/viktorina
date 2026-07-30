"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { RegisterFestiveDecor } from "@/components/RegisterFestiveDecor";
import {
  getEmailValidationError,
  isGeropharmEmail,
  isValidFullName,
} from "@/lib/quiz-config";
import {
  getValidParticipant,
  saveParticipant,
} from "@/lib/participant";
import type { AvailabilityResponse, SessionStartResponse } from "@/types/quiz";

async function startQuizSession(
  fullName: string,
  email: string
): Promise<{ ok: true; session: SessionStartResponse } | { ok: false; error: string }> {
  const res = await fetch("/api/session/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { ok: false, error: data.error ?? "Ошибка при создании сессии" };
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

  return { ok: true, session };
}

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
  const [autoStarting, setAutoStarting] = useState(true);
  const autoStartTried = useRef(false);

  const emailError = getEmailValidationError(email);
  const isFormValid = isValidFullName(fullName) && isGeropharmEmail(email);

  useEffect(() => {
    fetch("/api/quiz/availability")
      .then((r) => r.json())
      .then(setAvailability);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoStartTried.current) return;
    autoStartTried.current = true;

    const participant = getValidParticipant();
    if (!participant) {
      setAutoStarting(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const result = await startQuizSession(
          participant.fullName,
          participant.email
        );
        if (cancelled) return;

        if (!result.ok) {
          setError(result.error);
          setFullName(participant.fullName);
          setEmail(participant.email);
          setAutoStarting(false);
          setLoading(false);
          return;
        }

        saveParticipant(participant.fullName, participant.email);
        router.push(`/quiz/${result.session.sessionId}`);
      } catch {
        if (cancelled) return;
        setFullName(participant.fullName);
        setEmail(participant.email);
        setError("Не удалось подключиться к серверу");
        setAutoStarting(false);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleStart = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const result = await startQuizSession(fullName, email);

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      saveParticipant(fullName, email);
      router.push(`/quiz/${result.session.sessionId}`);
    } catch {
      setError("Не удалось подключиться к серверу");
      setLoading(false);
    }
  };

  if (autoStarting) {
    return (
      <div className="app-gradient--festive flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <AppShell centered background="none" gradient="festive" mainClassName="!p-0">
      <RegisterFestiveDecor />
      <div
        className={`register-page-screen register-page-enter w-full${visible ? " register-page-enter--visible" : ""}`}
      >
        <div
          className={`register-card-form registration-card register-card-enter quiz-card mx-auto${visible ? " register-card-enter--visible" : ""}`}
        >
          <h1 className="mb-1 text-2xl font-black text-brand-dark sm:text-3xl">
            Регистрация
          </h1>
          <p className="mb-6 text-sm font-medium text-[#3F2183] md:text-base">
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
                placeholder="ivanov@geropharm.com"
                className="quiz-input"
                autoComplete="email"
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-red-500">{emailError}</p>
              )}
              <p className="mt-1.5 text-xs text-brand-dark/50">
                Укажите корпоративную почту ГЕРОФАРМ (@geropharm.com)
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="quiz-intro-start-btn registration-form__actions mt-7 sm:mt-8">
            <Button
              fullWidth
              className="quiz-png-register-btn registration-button"
              onClick={handleStart}
              disabled={
                !isFormValid ||
                loading ||
                (availability !== null && !availability.available)
              }
              loading={loading}
            >
              Регистрация
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
