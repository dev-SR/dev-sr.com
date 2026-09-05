/** Ambient wash behind the sticky header so hang offset isn't a flat body-colored strip. */
export function PageTopGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={
        className ??
        'pointer-events-none absolute inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_65%)]'
      }
    />
  );
}
