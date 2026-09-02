import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  QUIZ_CONFIG,
  getEmailValidationError,
  isGeropharmEmail,
  isQuizAvailable,
  isValidEmail,
  isValidFullName,
  shuffleArray,
} from "@/lib/quiz-config";
import { QUESTIONS_BANK } from "@/lib/questions-bank";
import { isValidVenue } from "@/lib/locations";
import type { PublicQuestion, SessionStartResponse } from "@/types/quiz";

interface StartBody {
  fullName: string;
  email: string;
  location: string;
  consent: boolean;
}

/**
 * Создание сессии викторины.
 * - Проверка временного окна на сервере
 * - Выбор вопросов из локального банка
 * - started_at через now() в БД
 * - correct_index НЕ возвращается клиенту
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

    const body = (await request.json()) as StartBody;
    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    const location = body.location?.trim();

    if (!body.consent) {
      return NextResponse.json(
        { error: "Необходимо согласие на обработку персональных данных" },
        { status: 400 }
      );
    }

    if (!location || !isValidVenue(location)) {
      return NextResponse.json(
        { error: "Выберите площадку из списка" },
        { status: 400 }
      );
    }

    if (!fullName || !isValidFullName(fullName)) {
      return NextResponse.json(
        { error: "Укажите полное ФИО (минимум имя и фамилия)" },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Укажите корректный email" },
        { status: 400 }
      );
    }

    if (!isGeropharmEmail(email)) {
      return NextResponse.json(
        {
          error:
            getEmailValidationError(email) ??
            "Доступ только по корпоративной почте ГЕРОФАРМ (@geropharm.com)",
        },
        { status: 403 }
      );
    }

    if (QUESTIONS_BANK.length < QUIZ_CONFIG.questionsCount) {
      return NextResponse.json(
        { error: "Недостаточно вопросов в банке" },
        { status: 500 }
      );
    }

    const selected = shuffleArray([...QUESTIONS_BANK]).slice(
      0,
      QUIZ_CONFIG.questionsCount
    );
    const questionIds = selected.map((q) => q.id);

    const supabase = createServiceClient();

    let sessionId: string | null = null;
    let startedAt: string | null = null;

    const { data: rpcSessionId, error: sessionError } = await supabase.rpc(
      "create_quiz_session",
      {
        p_full_name: fullName,
        p_email: email.toLowerCase(),
        p_question_ids: questionIds,
        p_location: location,
      }
    );

    if (!sessionError && rpcSessionId) {
      sessionId = rpcSessionId as string;
    } else {
      console.warn("RPC create_quiz_session:", sessionError?.message);

      const { data: inserted, error: insertError } = await supabase
        .from("sessions")
        .insert({
          full_name: fullName,
          email: email.toLowerCase(),
          question_ids: questionIds,
          location,
        })
        .select("id, started_at")
        .single();

      if (insertError || !inserted) {
        console.error("Ошибка создания сессии:", insertError ?? sessionError);
        return NextResponse.json(
          { error: "Не удалось создать сессию" },
          { status: 500 }
        );
      }

      sessionId = inserted.id;
      startedAt = inserted.started_at;
    }

    if (!startedAt) {
      const { data: session, error: fetchError } = await supabase
        .from("sessions")
        .select("started_at")
        .eq("id", sessionId)
        .single();

      if (fetchError || !session) {
        return NextResponse.json(
          { error: "Не удалось получить данные сессии" },
          { status: 500 }
        );
      }

      startedAt = session.started_at;
    }

    const publicQuestions: PublicQuestion[] = selected.map((q) => ({
      id: q.id,
      text: `${q.context} ${q.prompt}`.trim(),
      context: q.context,
      prompt: q.prompt,
      options: q.options,
      image: q.image,
    }));

    const response: SessionStartResponse = {
      sessionId: sessionId as string,
      startedAt: startedAt,
      questions: publicQuestions,
      timeLimitMinutes: QUIZ_CONFIG.timeLimitMinutes,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Ошибка /api/session/start:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
