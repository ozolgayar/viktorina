"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { RuleItem } from "@/components/RuleItem";
import { useQuizStats } from "@/hooks/useQuizStats";
import { declension, formatTime } from "@/lib/utils";
import type { AvailabilityResponse } from "@/types/quiz";

/** Экран викторины — правила и кнопка старта */
export default function QuizIntroPage() {
  const router = useRouter();
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const { count, bestTime } = useQuizStats();

  useEffect(() => {
    fetch("/api/quiz/availability")
      .then((r) => r.json())
      .then((data: AvailabilityResponse) => {
        setAvailability(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStartClick = () => {
    if (!loading && availability !== null && !availability.available) return;
    setIsLeaving(true);
    setTimeout(() => router.push("/start"), 500);
  };

  return (
    <AppShell>
      <section
        className={`quiz-intro-screen page-enter${isLeaving ? " quiz-intro-screen--leaving" : ""}`}
      >
        <div className="quiz-intro-screen__inner">
          <div className="quiz-intro-screen__hero">
            <div className="quiz-intro-screen__hero-text">
              <h1 className="quiz-hero-title">Викторина ГЕРОФАРМ</h1>
              <p className="quiz-intro-screen__subtitle text-sm sm:text-base">
                Проверьте свои знания о компании и станьте экспертом ГЕРОФАРМ
              </p>

              {(count !== null || bestTime !== null) && (
                <div className="quiz-intro-stats">
                  {count !== null && count > 0 && (
                    <div className="quiz-intro-stat">
                      <Image
                        src="/icon/users.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="quiz-intro-stat__icon"
                        aria-hidden
                      />
                      <span className="quiz-intro-stat__value">{count}</span>
                      <span className="quiz-intro-stat__label">
                        {declension(count)} прошли
                      </span>
                    </div>
                  )}

                  {bestTime !== null && (
                    <div className="quiz-intro-stat">
                      <Image
                        src="/icon/zap.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="quiz-intro-stat__icon"
                        aria-hidden
                      />
                      <span className="quiz-intro-stat__value">
                        {formatTime(bestTime)}
                      </span>
                      <span className="quiz-intro-stat__label">
                        лучшее время
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="quiz-anniversary-badge">
              <span className="quiz-anniversary-badge__number">25</span>
              <span className="quiz-anniversary-badge__label">ЛЕТ УСПЕХА</span>
            </div>
          </div>

          <div className="quiz-card quiz-card--intro w-full">
            <p className="text-sm leading-relaxed text-brand-dark sm:text-base">
              Компания «ГЕРОФАРМ» — один из ведущих российских производителей
              лекарственных препаратов. В 2026 году мы отмечаем 25-летие и
              приглашаем вас принять участие в корпоративной викторине.
            </p>

            <p className="text-sm leading-relaxed text-brand-dark sm:text-base lg:text-lg">
              Ответьте правильно на{" "}
              <strong className="text-brand-accent">10 вопросов</strong> за{" "}
              <strong className="text-brand-accent">25 минут</strong>, и{" "}
              <strong className="text-brand-accent">приз ваш!</strong>
            </p>

            <div className="quiz-intro-rules rounded-xl bg-brand-light">
              <p className="mb-2 text-sm font-semibold text-brand-dark md:text-base">
                Правила викторины
              </p>
              <ul className="quiz-intro-rules-grid">
                <RuleItem>10 вопросов с 4 вариантами ответа</RuleItem>
                <RuleItem>Лимит времени — 25 минут</RuleItem>
                <RuleItem>Вопросы показываются по одному</RuleItem>
                <RuleItem>Вернуться к предыдущему вопросу нельзя</RuleItem>
              </ul>
            </div>

            {!loading && availability && !availability.available && (
              <div className="rounded-xl bg-brand-accent/10 p-4 text-center text-sm text-brand-accent-dark">
                {availability.message}
              </div>
            )}

            <div className="quiz-intro-start-btn block w-full sm:mx-auto sm:max-w-sm">
              <Button
                fullWidth
                className="!min-h-[44px] !py-4 !text-base !font-bold"
                disabled={
                  !loading && availability !== null && !availability.available
                }
                onClick={handleStartClick}
              >
                Начать викторину
              </Button>
            </div>

            <p className="quiz-intro-footer-note text-center text-xs text-brand-dark/40 md:text-sm">
              Если сразу не получилось правильно ответить на все 10 вопросов, то
              у вас есть возможность пройти викторину ещё раз.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
