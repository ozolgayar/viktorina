/** Ключ sessionStorage для факта входа администратора */
export const ADMIN_SESSION_KEY = "gerofarm_admin_auth";

/** Пароль администратора (сравнение на клиенте) */
export const ADMIN_PASSWORD = "gerofarm2025";

/** Заголовок Authorization для API */
export function getAdminAuthHeader(): string {
  return `Bearer ${ADMIN_PASSWORD}`;
}
