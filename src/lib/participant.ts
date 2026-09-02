/** Сохранённые данные участника для повторного входа без регистрации */

const STORAGE_KEY = "viktorina_participant";
const TTL_MS = 60 * 60 * 1000; // 1 час

export interface StoredParticipant {
  fullName: string;
  email: string;
  location?: string;
  registeredAt: number;
}

export function saveParticipant(
  fullName: string,
  email: string,
  location: string
): void {
  const data: StoredParticipant = {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    location: location.trim(),
    registeredAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getValidParticipant(): StoredParticipant | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as StoredParticipant;
    if (!data.fullName || !data.email || !data.registeredAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (Date.now() - data.registeredAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
