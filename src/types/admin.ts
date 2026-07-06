/** Запись сессии викторины для панели администратора */
export interface AdminSession {
  id: string;
  full_name: string;
  email: string;
  score: number | null;
  started_at: string;
  finished_at: string | null;
  answers: Record<string, number> | null;
  question_ids: string[];
}

export interface AdminStats {
  total: number;
  finished: number;
  averageScore: number;
  bestScore: number;
}

export type AdminTab = "all" | "winners";

export type SortField =
  | "full_name"
  | "email"
  | "score"
  | "finished_at"
  | "duration";

export type SortDirection = "asc" | "desc";
