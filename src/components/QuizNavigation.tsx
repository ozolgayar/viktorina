import { Timer } from "./Timer";
import type { UserAnswers } from "@/types/quiz";

interface QuizNavigationProps {
  currentIndex: number;
  total: number;
  questionIds: string[];
  answers: UserAnswers;
  remainingSeconds: number;
  warning: boolean;
  onNavigate: (index: number) => void;
}

/** Навигация по вопросам: стрелки, номера, таймер, прогресс-бар */
export function QuizNavigation({
  currentIndex,
  total,
  questionIds,
  answers,
  remainingSeconds,
  warning,
  onNavigate,
}: QuizNavigationProps) {
  const progress = ((currentIndex + 1) / total) * 100;

  const timer = (
    <Timer remainingSeconds={remainingSeconds} warning={warning} inline />
  );

  return (
    <nav className="quiz-nav w-full max-w-2xl" aria-label="Навигация по вопросам">
      <div className="quiz-nav__row">
        <div className="quiz-nav__row-main">
          <button
            type="button"
            className="quiz-nav__arrow"
            disabled={currentIndex === 0}
            onClick={() => onNavigate(currentIndex - 1)}
            aria-label="Предыдущий вопрос"
          >
            ‹
          </button>

          <div className="quiz-nav__numbers">
            {questionIds.map((id, index) => {
              const isAnswered = answers[id] !== undefined;
              const isCurrent = index === currentIndex;

              let stateClass = "quiz-nav__num--unanswered";
              if (isCurrent) stateClass = "quiz-nav__num--current";
              else if (isAnswered) stateClass = "quiz-nav__num--answered";

              return (
                <button
                  key={id}
                  type="button"
                  className={`quiz-nav__num ${stateClass}`}
                  onClick={() => onNavigate(index)}
                  aria-label={`Вопрос ${index + 1}`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="quiz-nav__arrow"
            disabled={currentIndex === total - 1}
            onClick={() => onNavigate(currentIndex + 1)}
            aria-label="Следующий вопрос"
          >
            ›
          </button>

          <div className="quiz-nav__timer quiz-nav__timer--inline">{timer}</div>
        </div>

        <div className="quiz-nav__timer quiz-nav__timer--mobile">{timer}</div>
      </div>

      <div className="quiz-nav__progress" aria-hidden>
        <div
          className="quiz-nav__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
