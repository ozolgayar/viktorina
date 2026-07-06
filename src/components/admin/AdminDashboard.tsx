"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { AdminLogin } from "./AdminLogin";
import { StatsCards } from "./StatsCards";
import { SessionsTable, exportSessionsToExcel } from "./SessionsTable";
import {
  ADMIN_SESSION_KEY,
  getAdminAuthHeader,
} from "@/lib/admin-client";
import {
  computeStats,
  filterSessions,
  sortSessions,
} from "@/lib/admin-utils";
import type {
  AdminSession,
  AdminTab,
  SortDirection,
  SortField,
} from "@/types/admin";

/** Главная панель администратора */
export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<AdminTab>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("finished_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/sessions", {
        headers: { Authorization: getAdminAuthHeader() },
      });

      if (res.status === 401) {
        onLogout();
        return;
      }

      if (!res.ok) {
        setError("Не удалось загрузить данные");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch {
      setError("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const stats = useMemo(() => computeStats(sessions), [sessions]);

  const tabSessions = useMemo(() => {
    if (tab === "winners") {
      return sessions.filter(
        (s) => s.finished_at !== null && s.score === 10
      );
    }
    return sessions.filter((s) => s.finished_at !== null);
  }, [sessions, tab]);

  const displayedSessions = useMemo(() => {
    const filtered = filterSessions(tabSessions, search);
    return sortSessions(filtered, sortField, sortDirection);
  }, [tabSessions, search, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="min-h-dvh bg-brand-light">
      {/* Шапка */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
        <Logo light={false} />
        <h1 className="hidden text-sm font-semibold text-brand-dark sm:block md:text-base">
          Панель администратора — Викторина 25 лет
        </h1>
        <button
          onClick={onLogout}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-brand-dark"
        >
          Выйти
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Статистика */}
        <StatsCards stats={stats} loading={loading} />

        {/* Вкладки и действия */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg bg-white p-1 shadow-sm">
            <button
              onClick={() => setTab("all")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === "all"
                  ? "bg-brand-primary text-white"
                  : "text-gray-600 hover:text-brand-dark"
              }`}
            >
              Все завершившие
            </button>
            <button
              onClick={() => setTab("winners")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === "winners"
                  ? "bg-brand-primary text-white"
                  : "text-gray-600 hover:text-brand-dark"
              }`}
            >
              10/10 правильно
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchSessions}
              disabled={loading}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-brand-primary hover:text-brand-primary disabled:opacity-50"
            >
              Обновить данные
            </button>
            <button
              onClick={() => exportSessionsToExcel(displayedSessions, tab)}
              disabled={loading || displayedSessions.length === 0}
              className="btn-primary !rounded-lg !px-4 !py-2 text-sm disabled:opacity-50"
            >
              Скачать Excel
            </button>
          </div>
        </div>

        {/* Поиск */}
        <div className="mt-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ФИО или Email..."
            className="quiz-input max-w-md bg-white"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Таблица */}
        <div className="mt-4">
          <SessionsTable
            sessions={displayedSessions}
            tab={tab}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

/** Корневой компонент страницы /admin */
export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");
    setChecked(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
  };

  if (!checked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-brand-light">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
