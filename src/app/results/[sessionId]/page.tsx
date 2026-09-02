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
        <div className="register-card-form result-card mx-auto text-center">
          <h1 className="result-title text-2xl font-bold md:text-3xl">
            Ваш результат {result.score}/{result.totalQuestions}
          </h1>
          <p className="result-description text-sm leading-relaxed md:mx-auto md:max-w-md md:text-base">
            Вы знаете о компании многое, но некоторые новости ускользнули в
            потоке информации. Чтобы получить приз, нужно ответить правильно на
            все 10 вопросов
          </p>

          <div className="result-info-box rounded-xl p-4 text-left md:p-5">
            <p className="result-note text-sm leading-relaxed md:text-base">
              Ответы на вопросы вы легко найдете на портале «Сфера», в
              телеграм-канале ГЕРОФАРМ LIFE и в официальных соцсетях ГЕРОФАРМ
            </p>
          </div>

          <div className="result-card__action">
            <Link href="/start" className="block w-full">
              <Button fullWidth className="result-primary-button">
                Пройти викторину повторно
              </Button>
            </Link>
          </div>

          <div className="result-card__action">
            <Link href="/" className="block w-full">
              <Button fullWidth className="result-secondary-button">
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
