/** Публичный вопрос — без correct_index */
export interface PublicQuestion {
  id: string;
  /** Полный текст (для совместимости) */
  text: string;
  /** Вводный абзац */
  context: string;
  /** Короткий вопрос */
  prompt: string;
  options: string[];
  image: string;
}

/** Вопрос с правильным ответом — только на сервере */
export interface QuestionWithAnswer extends PublicQuestion {
  correct_index: number;
}

/** Ответы пользователя: questionId -> индекс выбранного варианта */
export type UserAnswers = Record<string, number>;

export interface SessionStartResponse {
  sessionId: string;
  startedAt: string;
  questions: PublicQuestion[];
  timeLimitMinutes: number;
}

export interface SessionFinishResponse {
  score: number;
  totalQuestions: number;
  isPerfect: boolean;
  finishedAt: string;
}

export interface TimeRemainingResponse {
  remainingSeconds: number;
  expired: boolean;
  startedAt: string;
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface QuizFormData {
  fullName: string;
  email: string;
}
