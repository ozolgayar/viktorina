import { NextResponse } from "next/server";
import { isQuizAvailable } from "@/lib/quiz-config";
import type { AvailabilityResponse } from "@/types/quiz";

/** Проверка доступности викторины по серверному времени */
export async function GET() {
  const result = isQuizAvailable();

  const response: AvailabilityResponse = {
    available: result.available,
    message: result.message,
  };

  return NextResponse.json(response);
}
