"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from "@/lib/admin-client";

interface AdminLoginProps {
  onSuccess: () => void;
}

/** Форма входа в панель администратора */
export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="app-gradient flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl page-enter">
        <div className="mb-6 flex justify-center">
          <Logo light={false} className="mx-auto" />
        </div>

        <h1 className="mb-6 text-center text-xl font-bold text-brand-dark">
          Панель администратора
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-brand-dark"
            >
              Пароль
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="quiz-input"
              placeholder="Введите пароль"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">Неверный пароль</p>
          )}

          <button type="submit" className="btn-primary w-full">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
