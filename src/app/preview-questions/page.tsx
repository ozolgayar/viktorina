"use client";

import { AppShell } from "@/components/AppShell";
import { AnswerOption } from "@/components/AnswerOption";
import {
  QUESTIONS_BANK,
  getQuestionImageAlign,
  getQuestionImageAlignClass,
  getQuestionNumberFromImage,
} from "@/lib/questions-bank";
import { formatQuizText } from "@/lib/quiz-typography";

/** Локальный просмотр всего банка вопросов */
export default function PreviewAllQuestionsPage() {
  const questions = [...QUESTIONS_BANK].sort((a, b) => {
    const na = getQuestionNumberFromImage(a.image) ?? 0;
    const nb = getQuestionNumberFromImage(b.image) ?? 0;
    return na - nb;
  });

  return (
    <AppShell background="none" gradient="festive" mainClassName="!p-0">
      <div className="preview-all-questions">
        <header className="preview-all-questions__header">
          <div className="preview-all-questions__header-inner">
            <h1 className="preview-all-questions__title">
              Все вопросы банка ({questions.length})
            </h1>
            <p className="preview-all-questions__note">
              Локальный просмотр. Верный ответ подсвечен оранжевым.
            </p>
            <nav className="preview-all-questions__nav" aria-label="Навигация по вопросам">
              {questions.map((question) => {
                const n = getQuestionNumberFromImage(question.image) ?? "?";
                return (
                  <a
                    key={question.id}
                    href={`#question-${n}`}
                    className="preview-all-questions__nav-link"
                  >
                    {n}
                  </a>
                );
              })}
            </nav>
          </div>
        </header>

        <div className="preview-all-questions__list">
          {questions.map((question) => {
            const n = getQuestionNumberFromImage(question.image) ?? 0;
            const align = getQuestionImageAlign(question.image);
            const alignClass = getQuestionImageAlignClass(align);
            const contextText = formatQuizText(question.context || "");
            const promptText = formatQuizText(question.prompt);
            const isWideQuestion = contextText.length >= 500;
            const questionImage = question.image || null;

            return (
              <section
                key={question.id}
                id={`question-${n}`}
                className={`quiz-question-screen preview-all-questions__screen${
                  isWideQuestion ? " quiz-question-screen--wide" : ""
                }`}
              >
                <div className="quiz-question-screen__inner">
                  <div className="preview-all-questions__label">
                    Вопрос банка №{n}
                  </div>

                  <div
                    className={`quiz-question-card${
                      isWideQuestion ? " quiz-question-card--wide" : ""
                    }`}
                  >
                    <div className="quiz-card quiz-question-panel rounded-2xl shadow-xl">
                      <div
                        className={`quiz-question-panel__top${
                          questionImage
                            ? ""
                            : " quiz-question-panel__top--no-media"
                        }`}
                      >
                        <div className="quiz-question-panel__copy">
                          <p className="quiz-question-card__title">{n} / {questions.length}</p>

                          {contextText ? (
                            <p className="quiz-question-panel__context">
                              {contextText}
                            </p>
                          ) : null}
                        </div>

                        {questionImage ? (
                          <div
                            className={`quiz-question-panel__media ${alignClass}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={questionImage}
                              alt=""
                              className="quiz-question-panel__image"
                            />
                          </div>
                        ) : null}
                      </div>

                      {question.hashtags ? (
                        <p className="quiz-question-panel__hashtags">
                          {question.hashtags}
                        </p>
                      ) : null}

                      <div className="quiz-question-panel__box">
                        <p className="quiz-question-panel__prompt">{promptText}</p>

                        <div className="quiz-answer-options quiz-answer-options--panel">
                          {question.options.map((option, index) => {
                            const isCorrect = index === question.correct_index;
                            return (
                              <div
                                key={`${question.id}-${index}`}
                                className={
                                  isCorrect
                                    ? "preview-all-questions__correct-wrap"
                                    : undefined
                                }
                              >
                                <AnswerOption
                                  label={
                                    isCorrect ? `${option} ✓` : option
                                  }
                                  index={index}
                                  selected={isCorrect}
                                  disabled={false}
                                  variant="radio"
                                  onSelect={() => undefined}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
