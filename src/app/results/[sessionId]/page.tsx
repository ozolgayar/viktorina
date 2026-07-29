"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { RegisterFestiveDecor } from "@/components/RegisterFestiveDecor";
import {
  PerfectResultCard,
  ResultsFestiveBackground,
} from "@/components/ResultsCelebration";
import type { SessionFinishResponse } from "@/types/quiz";

/** Экран результата */
export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [result, setResult] = useState<SessionFinishResponse | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`result_${sessionId}`);
    if (stored) {
      setResult(JSON.parse(stored) as SessionFinishResponse);
    }
  }, [sessionId]);

  if (!result) {
    return (
      <div className="app-gradient--festive flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  if (result.isPerfect) {
    return (
      <AppShell
        centered
        hideHeader
        background="none"
        gradient="festive"
        mainClassName="!p-0 overflow-y-auto"
        overlay={<ResultsFestiveBackground />}
      >
        <div className="results-celebration-screen">
          <PerfectResultCard
            score={result.score}
            totalQuestions={result.totalQuestions}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      centered
      hideHeader
      background="none"
      gradient="festive"
      mainClassName="!p-0"
      overlay={<RegisterFestiveDecor />}
    >
      <div className="register-page-screen page-enter">
        <div className="register-card-form quiz-card mx-auto text-center">
          <h1 className="mb-2 text-2xl font-bold text-brand-accent md:text-3xl">
            Ваш результат {result.score}/{result.totalQuestions}
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-brand-dark/70 md:mx-auto md:max-w-md md:text-base">
            Вы знаете о компании «ГЕРОФАРМ» многое, но не всё. Чтобы получить
            приз, нужно ответить{" "}
            <strong className="text-brand-dark">
              верно на все 10 вопросов
            </strong>
            .
          </p>

          <div
            className="mb-6 rounded-xl p-4 text-left md:p-5"
            style={{ background: "#F5F0FE" }}
          >
            <p className="text-sm leading-relaxed text-brand-dark/80 md:text-base">
              Если сразу не получилось — у вас есть возможность пройти викторину
              ещё раз. Удачи!
            </p>
          </div>

          <div className="quiz-intro-start-btn mb-3">
            <Link href="/start" className="block w-full">
              <Button fullWidth className="quiz-png-register-btn">
                Пройти викторину повторно
              </Button>
            </Link>
          </div>

          <div className="quiz-intro-start-btn">
            <Link href="/" className="block w-full">
              <Button
                fullWidth
                variant="outline"
                className="!border-[#3F2183] !text-[#3F2183] hover:!bg-[#3F2183]/5"
              >
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
