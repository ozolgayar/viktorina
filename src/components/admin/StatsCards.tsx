import type { AdminStats } from "@/types/admin";

interface StatsCardsProps {
  stats: AdminStats;
  loading: boolean;
}

/** 4 карточки статистики */
export function StatsCards({ stats, loading }: StatsCardsProps) {
  const items = [
    { label: "Всего участников", value: stats.total },
    { label: "Завершили викторину", value: stats.finished },
    { label: "Средний результат", value: stats.averageScore },
    { label: "Лучший результат", value: stats.bestScore },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl bg-white p-5 shadow-sm"
        >
          {loading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="text-3xl font-bold text-brand-primary">{item.value}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
