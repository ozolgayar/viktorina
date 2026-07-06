"use client";

import * as XLSX from "xlsx";
import type { AdminSession, AdminTab, SortDirection, SortField } from "@/types/admin";
import {
  formatDateTime,
  getDurationMinutes,
  getExportFilename,
  getScoreColor,
} from "@/lib/admin-utils";

interface SessionsTableProps {
  sessions: AdminSession[];
  tab: AdminTab;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  loading: boolean;
}

const COLUMNS: { key: SortField | "index"; label: string; sortable: boolean }[] = [
  { key: "index", label: "№", sortable: false },
  { key: "full_name", label: "ФИО", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "score", label: "Результат", sortable: true },
  { key: "finished_at", label: "Дата прохождения", sortable: true },
  { key: "duration", label: "Время (мин)", sortable: true },
];

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) {
  if (sortField !== field) return <span className="ml-1 text-gray-300">↕</span>;
  return (
    <span className="ml-1 text-brand-primary">
      {sortDirection === "asc" ? "↑" : "↓"}
    </span>
  );
}

/** Экспорт текущих данных в Excel */
export function exportSessionsToExcel(
  sessions: AdminSession[],
  tab: AdminTab
) {
  const rows = sessions.map((s) => ({
    ФИО: s.full_name,
    Email: s.email,
    Результат: s.score !== null ? `${s.score}/10` : "—",
    "Дата прохождения": s.finished_at
      ? formatDateTime(s.finished_at)
      : "—",
    "Время прохождения (мин)":
      s.finished_at && s.started_at
        ? getDurationMinutes(s.started_at, s.finished_at)
        : "—",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sessions");
  XLSX.writeFile(wb, getExportFilename(tab));
}

/** Таблица участников */
export function SessionsTable({
  sessions,
  tab,
  sortField,
  sortDirection,
  onSort,
  loading,
}: SessionsTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-12 shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary" />
        <p className="mt-4 text-center text-sm text-gray-500">
          Загрузка данных...
        </p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <p className="text-gray-500">Пока нет участников</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold text-brand-dark ${
                  col.sortable ? "cursor-pointer select-none hover:text-brand-primary" : ""
                }`}
                onClick={() =>
                  col.sortable && col.key !== "index" && onSort(col.key as SortField)
                }
              >
                {col.label}
                {col.sortable && col.key !== "index" && (
                  <SortIcon
                    field={col.key as SortField}
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => {
            const duration =
              session.finished_at && session.started_at
                ? getDurationMinutes(session.started_at, session.finished_at)
                : null;

            return (
              <tr
                key={session.id}
                className="border-b border-gray-50 transition hover:bg-gray-50/50"
              >
                <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-brand-dark">
                  <span className="inline-flex items-center gap-2">
                    {session.full_name}
                    {tab === "winners" && session.score === 10 && (
                      <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-xs font-semibold text-brand-accent">
                        Победитель
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{session.email}</td>
                <td className="px-4 py-3">
                  <span
                    className="font-semibold"
                    style={{ color: getScoreColor(session.score) }}
                  >
                    {session.score !== null ? `${session.score}/10` : "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {session.finished_at
                    ? formatDateTime(session.finished_at)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {duration !== null ? duration : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
