const NON_BREAKING_WORDS = [
  "а",
  "бы",
  "в",
  "до",
  "же",
  "за",
  "и",
  "или",
  "к",
  "как",
  "ли",
  "на",
  "не",
  "но",
  "о",
  "от",
  "по",
  "с",
  "у",
  "что",
];

const NBSP = "\u00A0";
const serviceWordsPattern = NON_BREAKING_WORDS.join("|");
const shortWordRegex = new RegExp(
  `(^|[\\s${NBSP}(\\[{"«,;:!?—-])(${serviceWordsPattern})([ \\t]+)`,
  "giu"
);

/**
 * Убирает висячие короткие служебные слова в текстах квиза.
 * Не трогает переносы строк и не запрещает обычный перенос длинного текста.
 */
export function formatQuizText(text: string | null | undefined) {
  if (!text) return "";

  return text.replace(
    shortWordRegex,
    (_match, prefix: string, word: string) => `${prefix}${word}${NBSP}`
  );
}
