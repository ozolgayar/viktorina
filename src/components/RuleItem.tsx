interface RuleItemProps {
  children: React.ReactNode;
}

/** Пункт правил с иконкой галочки */
export function RuleItem({ children }: RuleItemProps) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-brand-dark/80">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2 6L5 9L10 3"
            stroke="#00A88E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </li>
  );
}
