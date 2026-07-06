"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
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
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`result_${sessionId}`);
    if (stored) {
      const data = JSON.parse(stored) as SessionFinishResponse;
      setResult(data);
      if (data.isPerfect) setShowThankYou(true);
    }
  }, [sessionId]);

  if (!result) {
    return (
      <div className="app-gradient flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  if (result.isPerfect) {
    return (
      <AppShell
        centered
        background="none"
        gradient="sky"
        mainClassName="!p-0 overflow-y-auto"
        overlay={<ResultsFestiveBackground />}
      >
        <div className="results-celebration-screen">
          <PerfectResultCard
            score={result.score}
            totalQuestions={result.totalQuestions}
          />
        </div>

        <Modal
          open={showThankYou}
          onClose={() => setShowThankYou(false)}
          title="Спасибо!"
          subtitle="Поздравляем!"
          actionLabel="Отлично"
          onAction={() => setShowThankYou(false)}
        >
          <p>
            Ваш результат сохранён. Организаторы свяжутся с победителями по
            указанному email.
          </p>
        </Modal>
      </AppShell>
    );
  }

  return (
    <AppShell centered background="none" mainClassName="!p-0 min-h-screen overflow-y-auto px-4 py-8">
      <div className="page-enter w-full max-w-lg mx-auto">
        <div className="quiz-card mx-auto rounded-2xl p-6 text-center shadow-xl sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-brand-accent md:text-3xl lg:text-4xl">
            Ваш результат {result.score}/{result.totalQuestions}
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-brand-dark/70 md:mx-auto md:max-w-md md:text-base lg:mb-8 lg:max-w-lg lg:text-lg">
            Вы знаете о компании «ГЕРОФАРМ» многое, но не всё. Чтобы получить
            приз, нужно ответить{" "}
            <strong className="text-brand-dark">
              верно на все 10 вопросов
            </strong>
            .
          </p>

          <div className="mb-6 rounded-xl bg-brand-light p-4 text-left md:p-5 lg:mb-8">
            <p className="text-sm leading-relaxed text-brand-dark/80 md:text-base">
              Если сразу не получилось — у вас есть возможность пройти викторину
              ещё раз. Удачи!
            </p>
          </div>

          <Link
            href="/start"
            className="mb-3 block md:mx-auto md:max-w-sm lg:max-w-md"
          >
            <Button fullWidth variant="secondary">
              Пройти викторину повторно
            </Button>
          </Link>

          <Link href="/" className="block md:mx-auto md:max-w-sm lg:max-w-md">
            <Button fullWidth variant="outline">
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
