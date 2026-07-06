import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "./env";

/**
 * Серверный клиент Supabase с service role key.
 * Используется ТОЛЬКО в Route Handlers и Server Actions.
 * Никогда не импортировать в клиентские компоненты.
 */
export function createServiceClient() {
  const { url, serviceRoleKey } = getSupabaseServerConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
