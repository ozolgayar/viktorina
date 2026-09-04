"use client";

import { useState } from "react";
import { AnswerOption } from "@/components/AnswerOption";
import { AppShell } from "@/components/AppShell";
import {
  QUESTIONS_BANK,
  getQuestionImageAlign,
  getQuestionImageAlignClass,
  getQuestionNumberFromImage,
  type QuestionImageAlign,
} from "@/lib/questions-bank";
import { formatQuizText } from "@/lib/quiz-typography";

const PREVIEW_NUMBERS = [6, 10, 15, 16, 25, 41, 44, 46] as const;

const ALIGN_LABEL: Record<QuestionImageAlign, string> = {
  center: "Центр",
  top: "Верх",
  bottom: "Низ",
};

export default function ImageAlignPreviewPage() {
  const [selected, setSelected] = useState<Record<string, number>>({});

  const items = PREVIEW_NUMBERS.map((n) => {
    const question = QUESTIONS_BANK.find(
      (q) => getQuestionNumberFromImage(q.image) === n
    );
    return { n, question };
  });

  return (
    <AppShell background="none" gradient="festive" mainClassName="!p-0">
      <div className="image-align-preview-stack">
        <div className="image-align-preview-stack__note">
          Превью как в викторине — вопросы {PREVIEW_NUMBERS.join(", ")}
        </div>

        {items.map(({ n, question }) => {
          if (!question) {
            return (
              <div key={n} className="quiz-question-screen">
                <div className="quiz-question-screen__inner">
                  <p className="text-white">Вопрос {n} не найден</p>
                </div>
              </div>
            );
          }

          const align = getQuestionImageAlign(question.image);
          const alignClass = getQuestionImageAlignClass(align);
          const contextText = formatQuizText(question.context || "");
          const promptText = formatQuizText(question.prompt);
          const isWideQuestion = contextText.length >= 500;
          const selectedIndex = selected[question.id];

          return (
            <div
              key={question.id}
              className={`quiz-question-screen image-align-preview-stack__screen${
                isWideQuestion ? " quiz-question-screen--wide" : ""
              }`}
            >
              <div className="quiz-question-screen__inner">
                <div className="image-align-preview-stack__label">
                  Вопрос банка №{n} · выравнивание: {ALIGN_LABEL[align]}
                </div>

                <div
                  className={`quiz-question-card${
                    isWideQuestion ? " quiz-question-card--wide" : ""
                  }`}
                >
                  <div className="quiz-card quiz-question-panel rounded-2xl shadow-xl">
                    <div className={`quiz-question-panel__media ${alignClass}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={question.image}
                        alt=""
                        className="quiz-question-panel__image"
                      />
                    </div>

                    <p className="quiz-question-card__title">Вопрос {n}</p>

                    {contextText ? (
                      <p className="quiz-question-panel__context">{contextText}</p>
                    ) : null}

                    <div className="quiz-question-panel__box">
                      <p className="quiz-question-panel__prompt">{promptText}</p>

                      <div className="quiz-answer-options quiz-answer-options--panel">
                        {question.options.map((option, index) => (
                          <AnswerOption
                            key={`${question.id}-${index}`}
                            label={option}
                            index={index}
                            selected={selectedIndex === index}
                            disabled={false}
                            variant="radio"
                            onSelect={() =>
                              setSelected((prev) => ({
                                ...prev,
                                [question.id]: index,
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
