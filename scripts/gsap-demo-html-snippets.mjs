/** HTML markup tabs for GSAP Learn ComponentPreview blocks (keyed by tsx/css fence title). */
export const HTML_SNIPPETS = {
  'toast-enter.tsx': `<!-- scope ref wraps all GSAP targets -->
<div>
  <!-- gsap.from('.gsap-toast', …) -->
  <div class="gsap-toast rounded-lg border bg-card px-4 py-3 shadow-md">
    <p>Changes saved</p>
    <p>Your settings were updated.</p>
  </div>
</div>`,

  'empty-state.tsx': `<div>
  <!-- gsap.from('.gsap-empty', …) -->
  <div class="gsap-empty flex flex-col items-center gap-2 rounded-xl border border-dashed px-8 py-10">
    <div>✦</div>
    <p>No projects yet</p>
    <button>New project</button>
  </div>
</div>`,

  'press-feedback.css': `<!-- CSS-only press — no GSAP -->
<button class="demo-press-btn">Save changes</button>`,

  'from-entrance.tsx': `<div>
  <div class="gsap-toast rounded-lg border bg-card px-4 py-3 shadow-md">
    Changes saved
  </div>
</div>`,

  'skeleton-fromto.tsx': `<div>
  <div class="gsap-skeleton h-4 w-3/4 rounded bg-muted"></div>
  <div class="gsap-skeleton h-4 w-full rounded bg-muted"></div>
  <div class="gsap-skeleton h-4 w-5/6 rounded bg-muted"></div>
  <div class="gsap-content space-y-2 pt-2">
    <p>Dashboard loaded</p>
    <p>12 active users · 98% uptime</p>
  </div>
</div>`,

  'set-before-sequence.tsx': `<div class="flex gap-2">
  <span class="gsap-dot size-3 rounded-full bg-accent"></span>
  <span class="gsap-dot size-3 rounded-full bg-accent"></span>
  <span class="gsap-dot size-3 rounded-full bg-accent"></span>
  <span class="gsap-dot size-3 rounded-full bg-accent"></span>
</div>`,

  'function-based-x.tsx': `<div class="gsap-avatars flex gap-2">
  <div class="gsap-avatar size-10 rounded-full"></div>
  <div class="gsap-avatar size-10 rounded-full"></div>
  <div class="gsap-avatar size-10 rounded-full"></div>
  <div class="gsap-avatar size-10 rounded-full"></div>
  <div class="gsap-avatar size-10 rounded-full"></div>
</div>`,

  'drawer-xpercent.tsx': `<aside class="gsap-drawer absolute right-0 top-0 h-full w-2/3 border-l bg-card p-4">
  <p>Settings</p>
  <p>Notifications, privacy, account.</p>
</aside>`,

  'popover-origin.tsx': `<div class="relative">
  <button>Filter</button>
  <!-- transformOrigin: 'top left' on .gsap-popover -->
  <div class="gsap-popover absolute left-0 top-full mt-2 w-44 rounded-lg border bg-card p-3">
    <p>Status</p>
    <p>Active · Draft · Archived</p>
  </div>
</div>`,

  'accordion-rotation.tsx': `<div class="rounded-lg border">
  <button>
    Billing details
    <span class="gsap-chevron inline-block">▼</span>
  </button>
  <div class="gsap-panel overflow-hidden px-4 pb-3">
    Update payment method and download invoices.
  </div>
</div>`,

  'transform-vs-layout.tsx': `<div>
  <p>Good: transform x (GPU)</p>
  <div class="relative h-10">
    <div class="gsap-good absolute left-0 top-1 size-8 rounded"></div>
  </div>
  <p>Avoid: left (layout)</p>
  <div class="relative h-10">
    <div class="gsap-bad absolute left-0 top-1 size-8 rounded"></div>
  </div>
</div>`,

  'ease-compare.tsx': `<div class="flex gap-4">
  <div class="gsap-toast rounded-lg border bg-card px-4 py-3">power2.out</div>
  <div class="gsap-toast rounded-lg border bg-card px-4 py-3">back.out</div>
  <div class="gsap-toast rounded-lg border bg-card px-4 py-3">elastic.out</div>
</div>`,

  'ease-in-vs-out.tsx': `<div class="flex gap-8">
  <div class="gsap-dropdown-out w-36 rounded-lg border bg-card p-3">Feels responsive</div>
  <div class="gsap-dropdown-in w-36 rounded-lg border bg-card p-3">Feels sluggish</div>
</div>`,

  'stagger-grid.tsx': `<div class="gsap-card-grid grid grid-cols-3 gap-2">
  <article class="gsap-card rounded-lg border bg-card p-3">Metric 1</article>
  <article class="gsap-card rounded-lg border bg-card p-3">Metric 2</article>
  <article class="gsap-card rounded-lg border bg-card p-3">Metric 3</article>
  <!-- …more .gsap-card items -->
</div>`,

  'stagger-nav.tsx': `<nav class="gsap-nav flex flex-col gap-1">
  <span class="gsap-nav-item rounded-md px-3 py-2">Overview</span>
  <span class="gsap-nav-item rounded-md px-3 py-2">Analytics</span>
  <span class="gsap-nav-item rounded-md px-3 py-2">Team</span>
</nav>`,

  'stagger-center.tsx': `<div class="flex flex-wrap gap-2">
  <span class="gsap-pill rounded-full border px-3 py-1">Design</span>
  <span class="gsap-pill rounded-full border px-3 py-1">Engineering</span>
  <span class="gsap-pill rounded-full border px-3 py-1">Product</span>
</div>`,

  'stagger-chat.tsx': `<div class="flex flex-col gap-2">
  <div class="gsap-msg self-start rounded-lg px-3 py-2">Hey, ship today?</div>
  <div class="gsap-msg self-end rounded-lg px-3 py-2">Almost — running tests.</div>
  <div class="gsap-msg self-start rounded-lg px-3 py-2">Nice. Ping me when green.</div>
</div>`,

  'transport-controls.tsx': `<div>
  <div class="relative h-16 rounded bg-muted/40">
    <div class="gsap-hero absolute left-2 top-2 size-12 rounded-lg"></div>
  </div>
  <button>Play</button>
  <button>Pause</button>
</div>`,

  'hover-reverse.tsx': `<div class="gsap-card-lift w-48 rounded-xl border bg-card p-4 shadow-sm">
  <p>Hover me</p>
  <p>Reverses on leave</p>
</div>`,

  'overwrite-auto.tsx': `<div>
  <div class="relative h-12 rounded bg-muted/40">
    <div class="gsap-toggle-box absolute left-2 top-2 size-8 rounded"></div>
  </div>
  <button>Toggle position</button>
</div>`,

  'scope-isolation.tsx': `<!-- Each scope only animates its own .box -->
<div><!-- Scope A -->
  <div class="relative h-12 w-32">
    <div class="box absolute left-1 top-1 size-10 rounded"></div>
  </div>
</div>
<div><!-- Scope B -->
  <div class="relative h-12 w-32">
    <div class="box absolute left-1 top-1 size-10 rounded"></div>
  </div>
</div>`,

  'revert-on-update.tsx': `<div class="relative h-14 rounded bg-muted/40">
  <div class="gsap-target absolute left-2 top-2 size-10 rounded-lg"></div>
</div>
<input type="range" min="0" max="120" />`,

  'context-safe-click.tsx': `<button class="gsap-bounce">Click for feedback</button>`,

  'match-media-reduced.tsx': `<div class="gsap-banner rounded-lg border bg-card px-4 py-3">
  Respects prefers-reduced-motion — fade only when reduced.
</div>`,

  'modal-timeline.tsx': `<div class="absolute inset-0 flex items-center justify-center">
  <div class="gsap-overlay absolute inset-0 bg-black/40"></div>
  <div class="gsap-modal relative w-64 rounded-xl border bg-card p-4">
    <p class="gsap-modal-item">Delete project?</p>
    <p class="gsap-modal-item">This cannot be undone.</p>
    <div class="gsap-modal-item flex gap-2">
      <button>Cancel</button>
      <button>Delete</button>
    </div>
  </div>
</div>`,

  'onboarding-timeline.tsx': `<div class="space-y-3">
  <div class="gsap-step-1 rounded-lg border bg-card px-3 py-2">Connect repository</div>
  <div class="gsap-step-2 rounded-lg border bg-card px-3 py-2">Configure CI</div>
  <div class="gsap-step-3 rounded-lg border bg-card px-3 py-2">Deploy preview</div>
</div>`,

  'splash-letters.tsx': `<div class="flex text-2xl font-bold">
  <span class="gsap-letter inline-block">L</span>
  <span class="gsap-letter inline-block">a</span>
  <span class="gsap-letter inline-block">u</span>
  <span class="gsap-letter inline-block">n</span>
  <span class="gsap-letter inline-block">c</span>
  <span class="gsap-letter inline-block">h</span>
</div>`,

  'label-tour.tsx': `<div>
  <div class="gsap-tour-dot mx-auto size-10 rounded-full"></div>
  <div class="gsap-tour-panel mt-4 rounded-lg border bg-card p-3 opacity-0">
    Step: intro / details / outro
  </div>
</div>`,

  'notification-stack.tsx': `<div class="flex flex-col gap-2">
  <div class="gsap-notif rounded-lg border bg-card px-3 py-2">Email sent</div>
  <div class="gsap-notif rounded-lg border bg-card px-3 py-2">Profile updated</div>
  <div class="gsap-notif rounded-lg border bg-card px-3 py-2">Invite accepted</div>
</div>`,

  'gsdevtools.tsx': `<div class="relative h-16 rounded bg-muted/40">
  <div class="gsap-dev-box absolute left-2 top-2 size-12 rounded-lg"></div>
</div>`,

  'scroll-reveal.tsx': `<div class="space-y-24">
  <section class="gsap-reveal rounded-lg border bg-card p-4">Section 1 — scroll to reveal</section>
  <section class="gsap-reveal rounded-lg border bg-card p-4">Section 2 — scroll to reveal</section>
  <section class="gsap-reveal rounded-lg border bg-card p-4">Section 3 — scroll to reveal</section>
</div>`,

  'scroll-scrub.tsx': `<div class="sticky top-0 h-1 rounded-full bg-muted">
  <div class="gsap-scrub-bar h-full w-full origin-left scale-x-0 bg-accent"></div>
</div>
<!-- scroll progress drives scaleX on .gsap-scrub-bar -->`,

  'scroll-pin.tsx': `<section class="gsap-pin-panel h-[200px]">
  <div class="gsap-pin-inner flex h-full items-center justify-center rounded-lg border bg-card">
    <p>Analytics</p>
    <p>Pinned while scrolling</p>
  </div>
</section>`,

  'scroll-to.tsx': `<div class="sticky top-0 flex gap-2">
  <button>Section A</button>
  <button>Section B</button>
</div>
<div id="sec-a" class="rounded-lg border bg-card p-6">Section A</div>
<div id="sec-b" class="rounded-lg border bg-card p-6">Section B</div>`,

  'scroll-batch.tsx': `<div class="grid grid-cols-2 gap-2">
  <div class="gsap-batch-card rounded-lg border bg-card p-3">Card 1</div>
  <div class="gsap-batch-card rounded-lg border bg-card p-3">Card 2</div>
  <!-- …more .gsap-batch-card items -->
</div>`,

  'horizontal-gallery.tsx': `<div class="flex w-[300%]">
  <div class="gsap-h-panel min-w-full">Design</div>
  <div class="gsap-h-panel min-w-full">Build</div>
  <div class="gsap-h-panel min-w-full">Ship</div>
</div>`,

  'toast-exit.tsx': `<div class="flex items-start gap-2">
  <div class="gsap-toast rounded-lg border bg-card px-4 py-3">
    Changes saved
  </div>
  <button>×</button>
</div>`,

  'sheet-dismiss.tsx': `<div class="relative h-full">
  <div class="absolute inset-0 bg-black/30"></div>
  <div class="gsap-sheet absolute bottom-0 left-0 right-0 rounded-t-xl border bg-card p-4">
    <p>Share link</p>
    <p>Copy or send to your team.</p>
  </div>
</div>`,

  'list-add.tsx': `<div class="space-y-2">
  <div class="gsap-list-item rounded-lg border bg-card px-3 py-2">Design review</div>
  <div class="gsap-list-item rounded-lg border bg-card px-3 py-2">API spec</div>
  <button>Add item</button>
</div>`,

  'error-shake.tsx': `<input
  class="gsap-shake-field w-full rounded-md border px-3 py-2"
  value="not-an-email"
  placeholder="Invalid email"
/>
<button>Submit (error)</button>`,

  'css-press.tsx': `<button class="demo-press-btn">Save changes</button>`,

  'split-text.tsx': `<h3 class="gsap-headline text-xl font-bold">
  Ship motion that feels right
</h3>
<!-- SplitText splits into chars: split.chars -->`,

  'scramble-text.tsx': `<p class="gsap-scramble font-mono">Loading........</p>`,

  'number-ticker.tsx': `<div class="text-center">
  <p>Active users</p>
  <p class="gsap-ticker text-3xl font-bold tabular-nums">0</p>
</div>`,

  'flip-layout.tsx': `<div class="grid grid-cols-3 gap-2">
  <div class="gsap-flip-item rounded-lg border bg-card px-3 py-2">Alpha</div>
  <div class="gsap-flip-item rounded-lg border bg-card px-3 py-2">Beta</div>
  <div class="gsap-flip-item rounded-lg border bg-card px-3 py-2">Gamma</div>
  <div class="gsap-flip-item rounded-lg border bg-card px-3 py-2">Delta</div>
</div>`,

  'draggable.tsx': `<div class="relative h-full rounded-lg border border-dashed">
  <div class="gsap-drag-card absolute cursor-grab rounded-lg border bg-card p-3">
    Drag me
  </div>
</div>`,

  'observer-swipe.tsx': `<div class="relative touch-pan-y">
  <div class="gsap-slide-track flex w-[300%]">
    <div class="min-w-full">Intro</div>
    <div class="min-w-full">Features</div>
    <div class="min-w-full">Pricing</div>
  </div>
</div>`,

  'draw-svg.tsx': `<svg viewBox="0 0 120 40" class="h-12 w-36">
  <path
    class="gsap-draw-path"
    d="M10,30 L30,10 L50,30 L70,10 L90,30 L110,10"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
  />
</svg>`,

  'morph-svg.tsx': `<svg viewBox="0 0 24 24" class="size-10">
  <path id="play-shape" class="gsap-morph-path" d="M8,5 L19,12 L8,19 Z" />
  <path id="pause-shape" d="M7,5 H10 V19 H7 Z M14,5 H17 V19 H14 Z" />
</svg>`,

  'motion-path.tsx': `<svg viewBox="0 0 200 80" class="h-20 w-48">
  <path id="route-path" d="M10,40 Q60,10 100,40 T190,40" fill="none" />
  <circle class="gsap-dot-path" r="6" cx="10" cy="40" />
</svg>`,

  'physics2d.tsx': `<div class="relative h-full overflow-hidden">
  <div class="gsap-ball absolute bottom-4 left-1/2 size-8 rounded-full"></div>
</div>`,

  'physics-props.tsx': `<div class="relative h-full overflow-hidden">
  <div class="gsap-glide absolute bottom-4 left-1/2 size-8 rounded-full"></div>
</div>`,

  'custom-wiggle.tsx': `<div class="gsap-wiggle-box size-16 rounded-lg"></div>`,

  'pixi-plugin.tsx': `<canvas><!-- Pixi stage; GSAP animates pixi sprite properties --></canvas>`,

  'quick-to.tsx': `<div class="relative h-full cursor-crosshair">
  <div class="gsap-follower absolute size-8 rounded-full"></div>
</div>`,

  'map-range.tsx': `<div class="sticky top-4 flex justify-center">
  <div class="gsap-dial size-12 rounded-full border-4 border-accent border-t-transparent"></div>
</div>`,

  'distribute.tsx': `<div class="flex gap-2">
  <div class="gsap-dist-item size-8 rounded"></div>
  <div class="gsap-dist-item size-8 rounded"></div>
  <div class="gsap-dist-item size-8 rounded"></div>
  <!-- …more .gsap-dist-item -->
</div>`,

  'snap-grid.tsx': `<div class="relative h-full">
  <div class="gsap-snap-block absolute size-8 rounded"></div>
</div>`,

  'random-stagger.tsx': `<div class="relative h-16 w-48">
  <span class="gsap-rand-dot absolute size-2 rounded-full"></span>
  <!-- …more .gsap-rand-dot -->
</div>`,

  'gpu-only.tsx': `<div>
  <div class="gsap-good absolute size-8 rounded"></div>
  <div class="gsap-bad absolute size-8 rounded"></div>
</div>`,

  'shared-element.tsx': `<div class="relative flex gap-1 rounded-lg bg-muted p-1">
  <span class="gsap-indicator absolute inset-y-1 left-0 rounded-md bg-card"></span>
  <button class="gsap-indicator-target flex-1">A</button>
  <button class="gsap-indicator-target flex-1">B</button>
  <button class="gsap-indicator-target flex-1">C</button>
</div>`,

  'segmented-tabs.tsx': `<div class="relative flex gap-1 rounded-lg bg-muted p-1">
  <span class="gsap-indicator absolute inset-y-1 left-0 rounded-md bg-card shadow-sm"></span>
  <button class="gsap-indicator-target">Overview</button>
  <button class="gsap-indicator-target">Analytics</button>
  <button class="gsap-indicator-target">Billing</button>
</div>`,

  'origin-aware.tsx': `<nav>
  <button>
    <span>01</span>
    <span class="gsap-origin-bar"></span>
  </button>
</nav>`,

  'chapter-rail.tsx': `<nav>
  <button class="gsap-nav-item" style="--chapter-color: #ff6651">
    <span class="gsap-nav-wash"></span>
    <span class="gsap-nav-number">01</span>
    <span class="gsap-nav-bar"></span>
  </button>
</nav>
<section id="gsap-chapter-0" class="gsap-chapter-section">Overview</section>`,

  'direction-aware.tsx': `<button>1</button>
<button>2</button>
<button>3</button>
<div class="gsap-dir-panel">Panel content</div>`,

  'direction-tabs.tsx': `<div class="relative flex gap-4 border-b">
  <span class="gsap-indicator absolute bottom-0 left-0 h-0.5 bg-foreground"></span>
  <button class="gsap-indicator-target">Overview</button>
  <button class="gsap-indicator-target">Analytics</button>
  <button class="gsap-indicator-target">Billing</button>
</div>
<div class="gsap-dir-panel">…</div>`,

  'continuity.tsx': `<div class="overflow-hidden">
  <div class="gsap-continuity-track h-3 w-full origin-left scale-x-[0.35] rounded-full"></div>
</div>`,

  'search-expand.tsx': `<button aria-label="Open search">Search</button>
<div class="overflow-hidden">
  <div class="gsap-search-track origin-left scale-x-[0.35] rounded-md border">
    <input class="gsap-search-input opacity-0" placeholder="Search docs…" />
  </div>
</div>`,

  'merge.tsx': `<div class="relative h-24 w-56 overflow-visible">
  <div class="gsap-merge-left absolute size-16 rounded-xl border"></div>
  <span class="gsap-merge-plus absolute">+</span>
  <div class="gsap-merge-right absolute size-16 rounded-xl border"></div>
  <div class="gsap-merge-result absolute size-16 rounded-xl"></div>
</div>`,

  'glyph-merge.tsx': `<div class="relative h-24 w-56 overflow-visible">
  <div class="gsap-merge-left absolute">ে</div>
  <span class="gsap-merge-plus">+</span>
  <div class="gsap-merge-right absolute">ক</div>
  <div class="gsap-merge-result absolute">কে</div>
</div>`,
};

export function htmlTitleFor(fileTitle) {
  const base = fileTitle.replace(/\.(tsx|css|html)$/, '');
  return `${base}-markup.html`;
}

export function docsTabTitleFor(fileTitle) {
  const base = fileTitle.replace(/\.(tsx|css|html)$/, '').replace(/-/g, ' ');
  return base.charAt(0).toUpperCase() + base.slice(1);
}
