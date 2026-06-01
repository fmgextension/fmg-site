import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollListener = () => void;

let lenisInstance: Lenis | null = null;
const scrollListeners = new Set<ScrollListener>();

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function getLenisInstance() {
  return lenisInstance;
}

export function subscribeScroll(listener: ScrollListener) {
  scrollListeners.add(listener);
  listener();
  return () => {
    scrollListeners.delete(listener);
  };
}

export function notifyScroll() {
  scrollListeners.forEach((listener) => listener());
}

export function refreshScrollTriggers() {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
}

export function scheduleScrollRefresh() {
  if (typeof window === "undefined") return;

  const run = () => refreshScrollTriggers();

  requestAnimationFrame(run);
  window.setTimeout(run, 120);
  window.setTimeout(run, 480);

  if (document.fonts?.ready) {
    void document.fonts.ready.then(run);
  }
}
