'use client';

import PathVisualizer from '@/components/PathVisualizer';

const GSAP_COURSE_SCRIPT = `
MONTH 1 — GSAP React:
  Weeks:
    - Week 1:
        Title: Core + React
        Topics:
          - Getting started
          - Tweens
          - useGSAP
        DependsOn: []
    - Week 2:
        Title: Timelines + Scroll
        Topics:
          - Sequencing
          - Scroll triggers
        DependsOn: ["Week 1"]
    - Week 3:
        Title: Patterns + Plugins
        Topics:
          - UI patterns
          - Flip and Drag
        DependsOn: ["Week 2"]
    - Week 4:
        Title: Production
        Topics:
          - Utils
          - Craft
        DependsOn: ["Week 3"]
`;

export function GsapCoursePath() {
  return <PathVisualizer height={420} script={GSAP_COURSE_SCRIPT} />;
}
