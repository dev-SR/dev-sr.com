const LANGUAGE_LABELS: Record<string, string> = {
  ts: 'TS',
  tsx: 'TS',
  typescript: 'TS',
  js: 'JS',
  jsx: 'JS',
  javascript: 'JS',
  cs: 'CS',
  csharp: 'CS',
  css: 'CSS',
  html: 'HTML',
  bash: 'SH',
  sh: 'SH',
  shell: 'SH',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'MD',
  mdx: 'MDX',
  python: 'PY',
  py: 'PY',
  sql: 'SQL',
};

function getLanguageLabel(language: string) {
  const normalized = language.toLowerCase();
  return LANGUAGE_LABELS[normalized] ?? normalized.toUpperCase().slice(0, 4);
}

export function LanguageBadge({ language }: { language: string }) {
  const label = getLanguageLabel(language);

  return (
    <span
      aria-hidden
      className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#007ACC] px-0.5 text-[0.55rem] font-bold leading-none text-white">
      {label}
    </span>
  );
}
