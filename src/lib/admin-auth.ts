/** Проверка пароля администратора на сервере */
export function verifyAdminAuth(authHeader: string | null): boolean {
  const password = process.env.ADMIN_PASSWORD ?? "gerofarm2025";
  return authHeader === `Bearer ${password}`;
}
