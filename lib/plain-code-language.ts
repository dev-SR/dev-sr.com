/** Fences that should stay unhighlighted: no header, no line numbers. */
const PLAIN_CODE_LANGUAGES = new Set(['text', 'txt', 'plaintext', 'plain']);

export function isPlainCodeLanguage(language?: string | null): boolean {
  if (!language) return true;
  return PLAIN_CODE_LANGUAGES.has(language.toLowerCase());
}
