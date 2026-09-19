export const HASH_SCROLL_OFFSET = -92;

/** Smooth-scroll to an in-page heading id without a Next.js navigation / RSC fetch. */
export function scrollToHashId(id: string, { updateUrl = true }: { updateUrl?: boolean } = {}) {
  if (typeof document === 'undefined' || !id) return false;

  const element = document.getElementById(id);
  if (!element) return false;

  const y = element.getBoundingClientRect().top + window.pageYOffset + HASH_SCROLL_OFFSET;
  window.scrollTo({ top: y, behavior: 'smooth' });

  if (updateUrl) {
    const nextUrl = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.pushState(null, '', nextUrl);
  }

  return true;
}
