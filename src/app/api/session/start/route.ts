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
import type { PublicQuestion, SessionStartResponse } from "@/types/quiz";

interface StartBody {
  fullName: string;
  email: string;
}

/**
 * Создание сессии викторины.
 * - Проверка временного окна на сервере
 * - Выбор 10 случайных вопросов
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

    const supabase = createServiceClient();

    // Загружаем все вопросы (service role — видим correct_index, но не отдаём)
    const { data: allQuestions, error: qError } = await supabase
      .from("questions")
      .select("id, text, options, correct_index");

    if (qError || !allQuestions?.length) {
      console.error("Ошибка загрузки вопросов:", qError);
      return NextResponse.json(
        { error: "Не удалось загрузить вопросы" },
        { status: 500 }
      );
    }

    if (allQuestions.length < QUIZ_CONFIG.questionsCount) {
      return NextResponse.json(
        { error: "Недостаточно вопросов в базе данных" },
        { status: 500 }
      );
    }

    // Случайный выбор и перемешивание на сервере
    const selected = shuffleArray(allQuestions).slice(
      0,
      QUIZ_CONFIG.questionsCount
    );
    const questionIds = selected.map((q) => q.id);

    // Создаём сессию через RPC (started_at = now() на стороне БД)
    const { data: sessionId, error: sessionError } = await supabase.rpc(
      "create_quiz_session",
      {
        p_full_name: fullName,
        p_email: email.toLowerCase(),
        p_question_ids: questionIds,
      }
    );

    if (sessionError || !sessionId) {
      console.error("Ошибка создания сессии:", sessionError);
      return NextResponse.json(
        { error: "Не удалось создать сессию" },
        { status: 500 }
      );
    }

    // Получаем started_at из БД
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

    // Публичные вопросы без correct_index
    const publicQuestions: PublicQuestion[] = selected.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options as string[],
    }));

    const response: SessionStartResponse = {
      sessionId: sessionId as string,
      startedAt: session.started_at,
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
