"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AnswerOption } from "@/components/AnswerOption";
import { Modal } from "@/components/Modal";
import { QuizNavigation } from "@/components/QuizNavigation";
import { RegisterFestiveDecor } from "@/components/RegisterFestiveDecor";
import { Timer } from "@/components/Timer";
import type {
  PublicQuestion,
  SessionFinishResponse,
  UserAnswers,
} from "@/types/quiz";

interface QuizData {
  questions: PublicQuestion[];
  startedAt: string;
  timeLimitMinutes: number;
}

type SlideDirection = "left" | "right";
type AnimPhase = "idle" | "exit" | "enter";

const TOTAL_QUESTIONS = 10;

/** Экран вопроса викторины */
export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [timeExpiredModal, setTimeExpiredModal] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finishHint, setFinishHint] = useState("");
  const [animPhase, setAnimPhase] = useState<AnimPhase>("idle");
  const [slideDir, setSlideDir] = useState<SlideDirection>("right");
  const [enterVisible, setEnterVisible] = useState(false);
  const finishCalled = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`quiz_${sessionId}`);
    if (!stored) {
      router.replace("/start");
      return;
    }
    setQuizData(JSON.parse(stored) as QuizData);
  }, [sessionId, router]);

  const syncTimer = useCallback(async () => {
    try {
      const res = await fetch(`/api/session/time?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.remainingSeconds !== undefined) {
        setRemainingSeconds(data.remainingSeconds);
        if (data.expired) setTimeExpiredModal(true);
      }
    } catch {
      /* локальный fallback */
    }
  }, [sessionId]);

  useEffect(() => {
    syncTimer();
    const syncInterval = setInterval(syncTimer, 30000);
    return () => clearInterval(syncInterval);
  }, [syncTimer]);

  useEffect(() => {
    if (timeExpiredModal || finishing) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setTimeExpiredModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeExpiredModal, finishing]);

  const finishQuiz = useCallback(
    async (finalAnswers: UserAnswers) => {
      if (finishCalled.current) return;
      finishCalled.current = true;
      setFinishing(true);

      try {
        const res = await fetch("/api/session/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, answers: finalAnswers }),
        });

        const data = await res.json();
        if (!res.ok) console.error("Ошибка завершения:", data.error);

        sessionStorage.setItem(
          `result_${sessionId}`,
          JSON.stringify(data as SessionFinishResponse)
        );
        sessionStorage.removeItem(`quiz_${sessionId}`);
        router.push(`/results/${sessionId}`);
      } catch {
        finishCalled.current = false;
        setFinishing(false);
      }
    },
    [sessionId, router]
  );

  const navigateTo = useCallback(
    (newIndex: number) => {
      if (
        !quizData ||
        newIndex === currentIndex ||
        animPhase !== "idle" ||
        finishing ||
        newIndex < 0 ||
        newIndex >= TOTAL_QUESTIONS
      ) {
        return;
      }

      const dir: SlideDirection = newIndex > currentIndex ? "right" : "left";
      setSlideDir(dir);
      setAnimPhase("exit");
      setEnterVisible(false);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setAnimPhase("enter");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setEnterVisible(true));
        });
        setTimeout(() => {
          setAnimPhase("idle");
          setEnterVisible(false);
        }, 250);
      }, 150);
    },
    [quizData, currentIndex, animPhase, finishing]
  );

  const handleSelect = (index: number) => {
    if (!quizData || finishing) return;

    const question = quizData.questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: index }));
    setFinishHint("");
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigateTo(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      navigateTo(currentIndex + 1);
    }
  };

  const handleFinishClick = () => {
    if (!quizData) return;

    const complete = quizData.questions.every((q) => answers[q.id] !== undefined);
    if (!complete) {
      setFinishHint("Чтобы завершить викторину, ответь на все вопросы");
      return;
    }
    setFinishHint("");
    finishQuiz(answers);
  };

  const handleTimeExpired = () => {
    setTimeExpiredModal(false);
    finishQuiz(answers);
  };

  if (!quizData) {
    return (
      <div className="app-gradient flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  const question = quizData.questions[currentIndex];
  const questionIds = quizData.questions.map((q) => q.id);
  const selectedIndex = answers[question.id] ?? null;
  const allAnswered = quizData.questions.every((q) => answers[q.id] !== undefined);
  const isWarning = remainingSeconds <= 60;
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;
  const isFirstQuestion = currentIndex === 0;

  const cardAnimClass = [
    animPhase === "exit" && `quiz-question-card--exit-${slideDir}`,
    animPhase === "enter" && `quiz-question-card--enter-${slideDir}`,
    animPhase === "enter" && enterVisible && "quiz-question-card--enter-visible",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AppShell
      background="none"
      gradient="festive"
      mainClassName="!p-0"
      headerCenter={
        <Timer remainingSeconds={remainingSeconds} warning={isWarning} inline />
      }
    >
      <RegisterFestiveDecor />
      <div className="quiz-question-screen">
        <div className="quiz-question-screen__inner">
          <QuizNavigation
            currentIndex={currentIndex}
            total={TOTAL_QUESTIONS}
            questionIds={questionIds}
            answers={answers}
            onNavigate={navigateTo}
          />

          <div className={`quiz-question-card w-full max-w-4xl ${cardAnimClass}`}>
            <div className="quiz-card quiz-question-panel rounded-2xl shadow-xl">
              <div className="quiz-question-panel__top">
                <div className="quiz-question-panel__intro">
                  <p className="quiz-question-card__title">
                    Вопрос {currentIndex + 1} / {TOTAL_QUESTIONS}
                  </p>
                  <p className="quiz-question-panel__context">
                    {question.context || question.text}
                  </p>
                </div>
                {question.image ? (
                  <div className="quiz-question-panel__media">
                    <Image
                      src={question.image}
                      alt=""
                      width={480}
                      height={320}
                      className="quiz-question-panel__image"
                      unoptimized
                      priority
                    />
                  </div>
                ) : null}
              </div>

              <div className="quiz-question-panel__box">
                <p className="quiz-question-panel__prompt">
                  {question.prompt || question.text}
                </p>

                <div className="quiz-answer-options quiz-answer-options--panel">
                  {question.options.map((option, index) => (
                    <AnswerOption
                      key={`${question.id}-${index}`}
                      label={option}
                      index={index}
                      selected={selectedIndex === index}
                      disabled={finishing}
                      variant="radio"
                      onSelect={() => handleSelect(index)}
                    />
                  ))}
                </div>
              </div>

              {finishing && (
                <p className="mt-5 text-center text-sm text-brand-dark/50">
                  Подсчёт результата...
                </p>
              )}
            </div>

            <div
              className={`quiz-question-actions${isLastQuestion ? " quiz-question-actions--last-only" : ""}`}
            >
              {!isLastQuestion ? (
                <>
                  <button
                    type="button"
                    className="quiz-question-actions__prev"
                    onClick={handlePrev}
                    disabled={isFirstQuestion || finishing || animPhase !== "idle"}
                  >
                    Предыдущий вопрос
                  </button>

                  <button
                    type="button"
                    className="quiz-question-actions__next"
                    onClick={handleNext}
                    disabled={finishing || animPhase !== "idle"}
                  >
                    Следующий вопрос
                  </button>
                </>
              ) : (
                <div className="quiz-question-actions__finish-wrap">
                  <button
                    type="button"
                    className={`quiz-question-actions__finish ${
                      allAnswered && !finishing
                        ? "quiz-question-actions__finish--active"
                        : "quiz-question-actions__finish--inactive"
                    }`}
                    disabled={finishing}
                    onClick={handleFinishClick}
                  >
                    Завершить викторину
                  </button>
                  {finishHint && (
                    <p className="quiz-question-actions__finish-hint" role="status">
                      {finishHint}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={timeExpiredModal}
        title="Ваше время истекло!"
        actionLabel="Узнать результаты"
        onAction={handleTimeExpired}
        showClose={false}
      />
    </AppShell>
  );
}
