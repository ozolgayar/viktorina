/** Читает env в runtime (важно для serverless на Vercel). */
function readEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

/**
 * Конфиг Supabase для Route Handlers.
 *
 * На Vercel `NEXT_PUBLIC_*` вшиваются на этапе build — если переменной
 * не было при сборке, API routes получат пустое значение даже при runtime env.
 * Поэтому для сервера приоритет у `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY`.
 */
export function getSupabaseServerConfig() {
  const url = readEnv("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    const missing: string[] = [];
    if (!url) {
      missing.push("SUPABASE_URL (или NEXT_PUBLIC_SUPABASE_URL)");
    }
    if (!serviceRoleKey) {
      missing.push("SUPABASE_SERVICE_ROLE_KEY");
    }
    throw new Error(
      `Не заданы переменные окружения Supabase: ${missing.join(", ")}`
    );
  }

  return { url, serviceRoleKey };
}
