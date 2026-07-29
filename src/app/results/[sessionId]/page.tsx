"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { FestiveScreenDecor } from "@/components/FestiveScreenDecor";
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
    >
      <FestiveScreenDecor />
      <div className="register-page-screen page-enter">
        <div className="register-card-form quiz-card mx-auto">
          <h1 className="mb-1 text-2xl font-black text-brand-dark sm:text-3xl">
            Ваш результат
          </h1>
          <p className="mb-6 text-sm font-medium text-[#3F2183] md:text-base">
            {result.score}/{result.totalQuestions} · нужно 10 из 10
          </p>
          <p className="mb-6 text-sm leading-relaxed text-brand-dark/60 md:text-[0.9375rem] lg:mb-8">
            Вы знаете о компании «ГЕРОФАРМ» многое, но не всё. Чтобы получить
            приз, нужно ответить{" "}
            <strong className="text-brand-dark">
              верно на все 10 вопросов
            </strong>
            .
          </p>

          <div className="rounded-xl bg-brand-light p-4 md:p-5">
            <p className="text-sm leading-relaxed text-brand-dark/80 md:text-[0.9375rem]">
              Если сразу не получилось — у вас есть возможность пройти викторину
              ещё раз. Удачи!
            </p>
          </div>

          <div className="quiz-intro-start-btn mt-6 sm:mt-8">
            <Link href="/start" className="block w-full">
              <Button fullWidth className="quiz-png-register-btn">
                Пройти ещё раз
              </Button>
            </Link>
          </div>

          <Link
            href="/"
            className="mt-3 block text-center text-sm font-semibold text-[#3F2183] hover:underline md:text-[0.9375rem]"
          >
            На главную
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
