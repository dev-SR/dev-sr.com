# Project Memory

## Product Direction

- This is the Sharukh Rahman portfolio and technical blogging project.
- Keep the landing page visually expressive while preserving useful content: portfolio highlights, recent MDX post summaries, and interactive-tool signals.
- Maintain the existing dark visual identity with coral (`#F08F87`) and pale blue (`#ACC5D3`) accents.

## Animation Direction

- Preserve the navbar logo choreography. At the top, show `Sharukh [logo] Rahman`. While scrolling down, fade and collapse both names so only the centered logo remains. Reverse the sequence smoothly when returning to the top.
- Prefer GSAP timelines with scoped refs for scroll choreography. Avoid React state updates driven continuously by scroll position.
- The first-visit splash should echo the navbar logo sequence: logo reveal, names opening outward, a brief hold, then names collapsing away before exit.
- Respect `prefers-reduced-motion`.
- Use native Next.js / React View Transitions for route-level motion where appropriate. The current app opts in with `experimental.viewTransition`.

## Landing Layering

- Preserve the original background stacking model: render `<ParallaxWaves />` before the grid. Keep `<LetterGlitchLeftSide />` and `<LetterGlitchRightSide />` as the side columns with their component-level offsets and z-index. Pull only the center content column upward with `-mt-[60vh] z-30`.

## Known Project Notes

- App Router project using Next.js `16.2.6`, React `19.2.6`, Tailwind CSS v4, GSAP, Lenis, and MDX content.
- `pnpm lint` currently fails because of an existing ESLint 9 circular configuration issue.
- Turbopack build emits an existing NFT tracing warning related to filesystem-based MDX discovery.

## Additional Motion Rules

- Keep landing card reveals subtle: low travel distance, light blur, smooth easing, and staggered view-range timing.
- Canvas animation components must stop requestAnimationFrame loops and guard DOM refs during unmount because native route transitions can overlap teardown frames.

## Header Resting Position

- The shared header should rest lower on the page at top=0 and rise into its compact position while scrolling down.
- Blog cover heroes should start behind the header and use light top-edge fades plus a stronger bottom blend into the article background.
