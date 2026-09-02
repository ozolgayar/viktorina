"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { RegisterFestiveDecor } from "@/components/RegisterFestiveDecor";
import {
  getEmailValidationError,
  isGeropharmEmail,
  isValidFullName,
} from "@/lib/quiz-config";
import { VENUE_OPTIONS } from "@/lib/locations";
import {
  getValidParticipant,
  saveParticipant,
} from "@/lib/participant";
import type { AvailabilityResponse, SessionStartResponse } from "@/types/quiz";

async function startQuizSession(
  fullName: string,
  email: string,
  location: string
): Promise<{ ok: true; session: SessionStartResponse } | { ok: false; error: string }> {
  const res = await fetch("/api/session/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      email,
      location,
      consent: true,
    }),
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
  const [location, setLocation] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  const emailError = getEmailValidationError(email);
  const isFormValid =
    isValidFullName(fullName) &&
    isGeropharmEmail(email) &&
    location !== "" &&
    consent;

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
    const participant = getValidParticipant();
    if (!participant) return;

    setFullName(participant.fullName);
    setEmail(participant.email);
    if (participant.location) {
      setLocation(participant.location);
    }
  }, []);

  const handleStart = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const result = await startQuizSession(fullName, email, location);

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      saveParticipant(fullName, email, location);
      router.push(`/quiz/${result.session.sessionId}`);
    } catch {
      setError("Не удалось подключиться к серверу");
      setLoading(false);
    }
  };

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
          <p className="mb-4 text-sm font-medium text-[#3F2183] md:text-base">
            10 вопросов · 25 минут
          </p>
          <p className="registration-intro mb-5 text-sm leading-relaxed text-brand-dark/60 md:mb-6 md:text-[0.9375rem]">
            Вы можете отвечать на вопросы в любом порядке. Викторина доступна с
            10:00 11.09.2026 до 16:00 14.09.2026.
          </p>

          {availability && !availability.available && (
            <div className="mb-4 rounded-xl bg-brand-accent/10 p-3 text-sm text-brand-accent-dark">
              {availability.message}
            </div>
          )}

          <div className="registration-form-fields space-y-4 md:space-y-[1.125rem]">
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

            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-sm font-medium text-brand-dark md:text-[0.9375rem]"
              >
                Площадка
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="quiz-input quiz-select"
              >
                <option value="">Выберите свою площадку</option>
                {VENUE_OPTIONS.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </div>

            <label className="registration-consent flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="registration-consent__checkbox mt-0.5 shrink-0"
              />
              <span className="registration-consent__text text-xs leading-relaxed text-brand-dark/70 md:text-[0.8125rem]">
                Я даю свое согласие на обработку персональных данных для того,
                чтобы организаторы викторины могли связаться со мной для
                получения подарка
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="quiz-intro-start-btn registration-form__actions mt-6 sm:mt-7">
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
