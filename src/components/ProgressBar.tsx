interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

/** Прогресс-бар под шапкой на экране викторины */
export function ProgressBar({ current, total, className = "" }: ProgressBarProps) {
  const progress = Math.min(100, (current / total) * 100);

  return (
    <div className={`relative px-4 pb-1 pt-2 md:px-8 lg:px-0 ${className}`}>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/20 md:h-1.5">
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1.5 text-right text-xs text-white/80 md:text-sm">
        Вопрос {current} из {total}
      </p>
    </div>
  );
}
