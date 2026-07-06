import { useEffect, useState } from "react";

interface QuizStats {
  count: number | null;
  bestTime: number | null;
}

interface QuizStatsResponse {
  count: number;
  best_time: number | null;
}

export function useQuizStats(): QuizStats {
  const [stats, setStats] = useState<QuizStats>({
    count: null,
    bestTime: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/quiz/stats");
        if (!res.ok) return;

        const data = (await res.json()) as QuizStatsResponse;
        setStats({
          count: data.count ?? 0,
          bestTime: data.best_time ?? null,
        });
      } catch {
        // тихо игнорируем — бейджи просто не покажутся
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return stats;
}
