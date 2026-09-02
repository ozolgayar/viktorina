import { NextResponse } from "next/server";
import { QUIZ_CONFIG } from "@/lib/quiz-config";
import { createServiceClient } from "@/lib/supabase/server";

/** Статистика викторины: счётчик успешно прошедших и лучшее время */
export async function GET() {
  try {
    const supabase = createServiceClient();

    const { count, error: countError } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .not("finished_at", "is", null)
      .eq("score", QUIZ_CONFIG.questionsCount);

    if (countError) {
      console.error("Ошибка подсчёта сессий:", countError);
      return NextResponse.json(
        { error: "Не удалось загрузить статистику" },
        { status: 500 }
      );
    }

    const { data: perfectSessions, error: bestError } = await supabase
      .from("sessions")
      .select("started_at, finished_at")
      .not("finished_at", "is", null)
      .eq("score", QUIZ_CONFIG.questionsCount);

    if (bestError) {
      console.error("Ошибка лучшего времени:", bestError);
      return NextResponse.json(
        { error: "Не удалось загрузить статистику" },
        { status: 500 }
      );
    }

    let best_time: number | null = null;
    if (perfectSessions?.length) {
      best_time = Math.min(
        ...perfectSessions.map(
          (s) =>
            (new Date(s.finished_at!).getTime() -
              new Date(s.started_at).getTime()) /
            1000
        )
      );
    }

    return NextResponse.json({
      count: count ?? 0,
      best_time,
    });
  } catch (err) {
    console.error("Ошибка /api/quiz/stats:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
