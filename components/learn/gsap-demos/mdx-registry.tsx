'use client';

import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

const loading = () => (
  <div className="flex min-h-24 items-center justify-center text-xs text-muted-foreground">
    Loading demo…
  </div>
);

function demo<T extends Record<string, unknown>>(loader: () => Promise<T>, name: keyof T) {
  return dynamic(() => loader().then((m) => ({ default: m[name] as ComponentType })), {
    loading,
    ssr: false,
  });
}

export const gsapDemoComponents = {
  GsapToastEnter: demo(() => import('./tweens'), 'GsapToastEnter'),
  GsapEmptyStateEnter: demo(() => import('./tweens'), 'GsapEmptyStateEnter'),
  GsapSkeletonToContent: demo(() => import('./tweens'), 'GsapSkeletonToContent'),
  GsapSetBeforeSequence: demo(() => import('./tweens'), 'GsapSetBeforeSequence'),
  GsapAvatarRow: demo(() => import('./tweens'), 'GsapAvatarRow'),

  GsapDrawerSlide: demo(() => import('./transforms'), 'GsapDrawerSlide'),
  GsapOriginPopover: demo(() => import('./transforms'), 'GsapOriginPopover'),
  GsapAccordionChevron: demo(() => import('./transforms'), 'GsapAccordionChevron'),
  GsapFabRotate: demo(() => import('./transforms'), 'GsapFabRotate'),
  GsapTransformVsLayout: demo(() => import('./transforms'), 'GsapTransformVsLayout'),

  GsapEaseCompare: demo(() => import('./easing'), 'GsapEaseCompare'),
  GsapEaseInVsOut: demo(() => import('./easing'), 'GsapEaseInVsOut'),
  GsapCustomEaseTeaser: demo(() => import('./easing'), 'GsapCustomEaseTeaser'),

  GsapStaggerGrid: demo(() => import('./stagger'), 'GsapStaggerGrid'),
  GsapStaggerNav: demo(() => import('./stagger'), 'GsapStaggerNav'),
  GsapStaggerCenter: demo(() => import('./stagger'), 'GsapStaggerCenter'),
  GsapStaggerChat: demo(() => import('./stagger'), 'GsapStaggerChat'),

  GsapTransportControls: demo(() => import('./control'), 'GsapTransportControls'),
  GsapHoverReverse: demo(() => import('./control'), 'GsapHoverReverse'),
  GsapOverwriteAuto: demo(() => import('./control'), 'GsapOverwriteAuto'),

  GsapScopeIsolation: demo(() => import('./react-hooks'), 'GsapScopeIsolation'),
  GsapRevertOnUpdate: demo(() => import('./react-hooks'), 'GsapRevertOnUpdate'),
  GsapContextSafeClick: demo(() => import('./react-hooks'), 'GsapContextSafeClick'),
  GsapMatchMediaReduced: demo(() => import('./react-hooks'), 'GsapMatchMediaReduced'),

  GsapModalSequence: demo(() => import('./timelines'), 'GsapModalSequence'),
  GsapOnboardingBeat: demo(() => import('./timelines'), 'GsapOnboardingBeat'),
  GsapSplashLetters: demo(() => import('./timelines'), 'GsapSplashLetters'),
  GsapLabelTour: demo(() => import('./timelines'), 'GsapLabelTour'),
  GsapNotificationStack: demo(() => import('./timelines'), 'GsapNotificationStack'),
  GsapGSDevToolsDemo: demo(() => import('./timelines'), 'GsapGSDevToolsDemo'),

  GsapScrollReveal: demo(() => import('./scroll'), 'GsapScrollReveal'),
  GsapScrollScrub: demo(() => import('./scroll'), 'GsapScrollScrub'),
  GsapScrollPin: demo(() => import('./scroll'), 'GsapScrollPin'),
  GsapScrollBatch: demo(() => import('./scroll'), 'GsapScrollBatch'),
  GsapScrollToSection: demo(() => import('./scroll'), 'GsapScrollToSection'),
  GsapHorizontalGallery: demo(() => import('./scroll'), 'GsapHorizontalGallery'),

  GsapToastExit: demo(() => import('./ui-patterns'), 'GsapToastExit'),
  GsapSheetDismiss: demo(() => import('./ui-patterns'), 'GsapSheetDismiss'),
  GsapListAddRemove: demo(() => import('./ui-patterns'), 'GsapListAddRemove'),
  GsapErrorShake: demo(() => import('./ui-patterns'), 'GsapErrorShake'),
  GsapCssPressOnly: demo(() => import('./ui-patterns'), 'GsapCssPressOnly'),

  GsapSharedElementPrimitive: demo(() => import('./primitives'), 'GsapSharedElementPrimitive'),
  GsapSharedElementTabs: demo(() => import('./primitives'), 'GsapSharedElementTabs'),
  GsapOriginAwarePrimitive: demo(() => import('./primitives'), 'GsapOriginAwarePrimitive'),
  GsapChapterNav: demo(() => import('./primitives'), 'GsapChapterNav'),
  GsapDirectionAwarePrimitive: demo(() => import('./primitives'), 'GsapDirectionAwarePrimitive'),
  GsapDirectionAwareTabs: demo(() => import('./primitives'), 'GsapDirectionAwareTabs'),
  GsapContinuityPrimitive: demo(() => import('./primitives'), 'GsapContinuityPrimitive'),
  GsapSearchExpand: demo(() => import('./primitives'), 'GsapSearchExpand'),
  GsapMergePrimitive: demo(() => import('./primitives'), 'GsapMergePrimitive'),
  GsapGlyphMerge: demo(() => import('./primitives'), 'GsapGlyphMerge'),

  GsapSplitTextHeadline: demo(() => import('./text'), 'GsapSplitTextHeadline'),
  GsapScrambleLabel: demo(() => import('./text'), 'GsapScrambleLabel'),
  GsapNumberTicker: demo(() => import('./text'), 'GsapNumberTicker'),

  GsapFlipGrid: demo(() => import('./plugins'), 'GsapFlipGrid'),
  GsapDraggableCard: demo(() => import('./plugins'), 'GsapDraggableCard'),
  GsapObserverSwipe: demo(() => import('./plugins'), 'GsapObserverSwipe'),
  GsapDrawSvgLogo: demo(() => import('./plugins'), 'GsapDrawSvgLogo'),
  GsapMorphIcon: demo(() => import('./plugins'), 'GsapMorphIcon'),
  GsapMotionPathDot: demo(() => import('./plugins'), 'GsapMotionPathDot'),
  GsapPhysics2D: demo(() => import('./plugins'), 'GsapPhysics2D'),
  GsapPhysicsProps: demo(() => import('./plugins'), 'GsapPhysicsProps'),
  GsapCustomWiggleDemo: demo(() => import('./plugins'), 'GsapCustomWiggleDemo'),

  GsapQuickToFollower: demo(() => import('./utils'), 'GsapQuickToFollower'),
  GsapMapRangeProgress: demo(() => import('./utils'), 'GsapMapRangeProgress'),
  GsapDistributeScale: demo(() => import('./utils'), 'GsapDistributeScale'),
  GsapSnapGrid: demo(() => import('./utils'), 'GsapSnapGrid'),
  GsapRandomStagger: demo(() => import('./utils'), 'GsapRandomStagger'),

  GsapPixiSprite: demo(() => import('./pixi-demo'), 'GsapPixiSprite'),

  GsapCoursePath: demo(() => import('./course-path'), 'GsapCoursePath'),
};
