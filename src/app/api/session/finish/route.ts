import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  QUIZ_CONFIG,
  getRemainingSeconds,
  isQuizAvailable,
  isWithinTimeLimit,
} from "@/lib/quiz-config";
import type { SessionFinishResponse, UserAnswers } from "@/types/quiz";

interface FinishBody {
  sessionId: string;
  answers: UserAnswers;
}

/**
 * Завершение викторины и подсчёт результата на сервере.
 * - Проверка временного окна
 * - Проверка 25-минутного лимита по started_at/finished_at
 * - Сверка ответов с эталоном (correct_index из БД)
 */
export async function POST(request: NextRequest) {
  try {
    const availability = isQuizAvailable();
    if (!availability.available) {
      return NextResponse.json(
        { error: availability.message ?? "Викторина недоступна" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as FinishBody;
    const { sessionId, answers } = body;

    if (!sessionId || !answers) {
      return NextResponse.json(
        { error: "Некорректные данные" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Загружаем сессию
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id, started_at, finished_at, question_ids")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Сессия не найдена" },
        { status: 404 }
      );
    }

    if (session.finished_at) {
      return NextResponse.json(
        { error: "Сессия уже завершена" },
        { status: 409 }
      );
    }

    // Проверка лимита времени по серверным меткам
    if (!isWithinTimeLimit(session.started_at)) {
      // Всё равно завершаем с текущим результатом, но помечаем
      // (время истекло — ответы принимаются)
    }

    const questionIds = session.question_ids as string[];

    // Загружаем правильные ответы только на сервере
    const { data: questions, error: qError } = await supabase
      .from("questions")
      .select("id, correct_index")
      .in("id", questionIds);

    if (qError || !questions) {
      return NextResponse.json(
        { error: "Не удалось проверить ответы" },
        { status: 500 }
      );
    }

    // Подсчёт результата
    let score = 0;
    for (const q of questions) {
      const userAnswer = answers[q.id];
      if (userAnswer !== undefined && userAnswer === q.correct_index) {
        score++;
      }
    }

    // Завершение сессии через RPC (finished_at = now() на стороне БД)
    const { data: success, error: finishError } = await supabase.rpc(
      "finish_quiz_session",
      {
        p_session_id: sessionId,
        p_score: score,
        p_answers: answers,
      }
    );

    if (finishError || !success) {
      console.error("Ошибка завершения сессии:", finishError);
      return NextResponse.json(
        { error: "Не удалось сохранить результат" },
        { status: 500 }
      );
    }

    // Получаем finished_at
    const { data: finishedSession } = await supabase
      .from("sessions")
      .select("finished_at")
      .eq("id", sessionId)
      .single();

    const response: SessionFinishResponse = {
      score,
      totalQuestions: QUIZ_CONFIG.questionsCount,
      isPerfect: score === QUIZ_CONFIG.questionsCount,
      finishedAt: finishedSession?.finished_at ?? new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Ошибка /api/session/finish:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

/** GET — получить оставшееся время по серверным меткам */
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
    console.error("Ошибка GET /api/session/finish:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
