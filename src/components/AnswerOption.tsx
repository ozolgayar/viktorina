interface AnswerOptionProps {
  label: string;
  selected: boolean;
  disabled: boolean;
  index: number;
  onSelect: () => void;
  variant?: "check" | "radio";
}

/** Вариант ответа — белая карточка с галочкой или радио-кружком */
export function AnswerOption({
  label,
  selected,
  disabled,
  index,
  onSelect,
  variant = "check",
}: AnswerOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{ animationDelay: `${index * 0.05}s` }}
      className={`answer-option option-stagger ${selected ? "answer-option--selected" : ""}`}
    >
      {variant === "radio" ? (
        <span
          className={`quiz-answer-radio${selected ? " quiz-answer-radio--selected" : ""}`}
          aria-hidden
        />
      ) : (
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected
              ? "border-brand-primary bg-brand-primary"
              : "border-brand-border bg-white"
          }`}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}
