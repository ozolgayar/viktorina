/** Площадки для регистрации участников */
export const VENUE_OPTIONS = [
  "Завод в Пушкине",
  "Завод в Оболенске",
  "R&D Стрельна",
  "R&D Кирочная",
  "Офис Санкт-Петербург",
  "Офис Москва",
  "ПП Возрождения",
  "ПП Оптиков",
  "Региональный сотрудник",
  "Другое",
] as const;

export type VenueOption = (typeof VENUE_OPTIONS)[number];

export function isValidVenue(value: string): value is VenueOption {
  return (VENUE_OPTIONS as readonly string[]).includes(value);
}
