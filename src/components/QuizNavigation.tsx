import type { UserAnswers } from "@/types/quiz";

interface QuizNavigationProps {
  currentIndex: number;
  total: number;
  questionIds: string[];
  answers: UserAnswers;
  onNavigate: (index: number) => void;
}

/** Навигация по вопросам: стрелки, номера, прогресс-бар */
export function QuizNavigation({
  currentIndex,
  total,
  questionIds,
  answers,
  onNavigate,
}: QuizNavigationProps) {
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <nav className="quiz-nav" aria-label="Навигация по вопросам">
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

              const digit = index + 1;

              return (
                <button
                  key={id}
                  type="button"
                  className={`quiz-nav__num ${stateClass}`}
                  onClick={() => onNavigate(index)}
                  aria-label={`Вопрос ${digit}`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span
                    className={
                      digit === 1 ? "quiz-nav__num-digit--1" : undefined
                    }
                  >
                    {digit}
                  </span>
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
        </div>
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
