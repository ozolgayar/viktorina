"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { RegisterFestiveDecor } from "@/components/RegisterFestiveDecor";
import { RuleItem } from "@/components/RuleItem";
import { useQuizStats } from "@/hooks/useQuizStats";
import { formatTime } from "@/lib/utils";
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
    <AppShell
      background="none"
      gradient="festive"
      lockViewport
      shellClassName="quiz-intro-shell"
      mainClassName="quiz-intro-main !p-0"
      headerCenter={<span className="sr-only">Викторина к Юбилею ГЕРОФАРМ</span>}
      overlay={<RegisterFestiveDecor />}
    >
      <div className="quiz-page">
        <section className="quiz-main">
          <div
            className={`quiz-intro page-enter${isLeaving ? " quiz-intro-screen--leaving" : ""}`}
          >
            <div className="quiz-intro-screen__hero">
              <div className="quiz-intro-screen__hero-text">
                <h1 className="quiz-hero-title">Викторина к Юбилею ГЕРОФАРМ</h1>
                <p className="quiz-intro-screen__subtitle text-center text-sm sm:text-base">
                  Проверьте свои знания о компании и получите подарок
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
                          успешно прошли викторину
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
            </div>

            <div className="quiz-card quiz-card--intro w-full">
              <p className="quiz-intro-lead text-sm leading-snug text-brand-dark sm:text-[0.9375rem]">
                ГЕРОФАРМ – биотехнологическая компания, которая создает
                инновации для увеличения продолжительности активной жизни в
                России и в мире. Сегодня ГЕРОФАРМ является лидером на
                российском рынке препаратов для борьбы с лишним весом и лечения
                сахарного диабета. Это знают все. Но сотрудники знают о
                компании больше!
              </p>

              <p className="quiz-intro-lead text-sm leading-snug text-brand-dark sm:text-[0.9375rem]">
                Ваша задача – ответить правильно на{" "}
                <strong className="text-brand-accent">10 вопросов</strong> о
                компании за{" "}
                <strong className="text-brand-accent">25 минут</strong>.
              </p>

              <div className="quiz-intro-rules rounded-xl bg-brand-light">
                <p className="quiz-intro-rules__title text-sm font-semibold text-brand-dark">
                  Правила викторины
                </p>
                <ul className="quiz-intro-rules-grid">
                  <RuleItem>
                    Нужно ответить правильно на все 10 вопросов за 25 минут
                  </RuleItem>
                  <RuleItem>
                    Викторина работает в период с 10:00 11.09.2026 по 16:00
                    14.09.2026
                  </RuleItem>
                  <RuleItem>
                    В этот период викторину можно проходить бесконечное
                    количество раз
                  </RuleItem>
                  <RuleItem>
                    Подарок могут получить только сотрудники ГЕРОФАРМ
                  </RuleItem>
                  <RuleItem>
                    Подарок получат первые 500 сотрудников, справившиеся с
                    викториной
                  </RuleItem>
                  <RuleItem>Один подарок в одни руки</RuleItem>
                </ul>
              </div>

              {!loading && availability && !availability.available && (
                <div className="rounded-xl bg-brand-accent/10 p-3 text-center text-sm text-brand-accent-dark">
                  {availability.message}
                </div>
              )}

              <div className="quiz-intro-bottom">
                <div className="quiz-intro-start-btn">
                  <Button
                    fullWidth
                    className="quiz-png-register-btn"
                    disabled={
                      !loading && availability !== null && !availability.available
                    }
                    onClick={handleStartClick}
                  >
                    Регистрация
                  </Button>
                </div>

                <p className="quiz-intro-footer-note text-center text-xs text-brand-dark/40">
                  Если сразу не получилось правильно ответить на все 10
                  вопросов, то у вас есть возможность пройти викторину
                  ещё&nbsp;раз
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
