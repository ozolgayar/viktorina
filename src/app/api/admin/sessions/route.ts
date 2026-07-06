import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/admin/sessions
 * Возвращает все сессии из public.sessions через service role key.
 * Требует Authorization: Bearer <пароль>
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!verifyAdminAuth(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("sessions")
      .select(
        "id, full_name, email, score, started_at, finished_at, answers, question_ids"
      )
      .order("started_at", { ascending: false });

    if (error) {
      console.error("Ошибка загрузки sessions:", error);
      return NextResponse.json(
        { error: "Не удалось загрузить данные" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessions: data ?? [] });
  } catch (err) {
    console.error("Ошибка /api/admin/sessions:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
