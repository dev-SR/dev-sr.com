/** Fired when the site splash finishes or is skipped so page GSAP can start. */
export const PAGE_MOTION_READY_EVENT = 'devsr:page-motion-ready';

let pageMotionReady = false;

function isSplashBlocking() {
  const splash = document.querySelector('.site-splash');
  if (!splash) return false;
  // Guard CSS uses display:none — treat as not blocking.
  const css = window.getComputedStyle(splash);
  return css.display !== 'none' && css.visibility !== 'hidden';
}

function getWindowReady() {
  return (window as Window & { __devsrPageMotionReady?: boolean }).__devsrPageMotionReady === true;
}

function setWindowReady() {
  (window as Window & { __devsrPageMotionReady?: boolean }).__devsrPageMotionReady = true;
}

export function signalPageMotionReady() {
  if (typeof window === 'undefined') return;
  pageMotionReady = true;
  setWindowReady();
  window.dispatchEvent(new Event(PAGE_MOTION_READY_EVENT));
}

export function onPageMotionReady(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Window flag survives duplicate module instances (Next client bundles).
  const already = pageMotionReady || getWindowReady() || !isSplashBlocking();

  if (already) {
    const id = window.setTimeout(callback, 0);
    return () => window.clearTimeout(id);
  }

  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timeout);
    window.removeEventListener(PAGE_MOTION_READY_EVENT, fire);
    callback();
  };

  window.addEventListener(PAGE_MOTION_READY_EVENT, fire);
  // Failsafe if splash never signals (sibling effect-order / HMR races).
  const timeout = window.setTimeout(fire, 1200);

  return () => {
    done = true;
    window.removeEventListener(PAGE_MOTION_READY_EVENT, fire);
    window.clearTimeout(timeout);
  };
}
