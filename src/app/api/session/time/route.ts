import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getRemainingSeconds } from "@/lib/quiz-config";

/** Синхронизация таймера с сервером */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId обязателен" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    const { data: session, error } = await supabase
      .from("sessions")
      .select("started_at, finished_at")
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Сессия не найдена" }, { status: 404 });
    }

    if (session.finished_at) {
      return NextResponse.json({
        remainingSeconds: 0,
        expired: true,
        startedAt: session.started_at,
      });
    }

    const remainingSeconds = getRemainingSeconds(session.started_at);

    return NextResponse.json({
      remainingSeconds,
      expired: remainingSeconds <= 0,
      startedAt: session.started_at,
    });
  } catch (err) {
    console.error("Ошибка /api/session/time:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
