import { useEffect, useRef, useState } from "react";
import { subscribeScroll } from "@/lib/lenis-scroll";

type UseViewportInViewOptions = {
  amount?: number;
  once?: boolean;
  topInset?: number;
  bottomInset?: number;
  disabled?: boolean;
  /** Ignore elements hidden via opacity/visibility on self or ancestors (e.g. GSAP-faded hero). */
  requireVisible?: boolean;
};

function isEffectivelyVisible(el: HTMLElement) {
  let node: HTMLElement | null = el;
  while (node) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (parseFloat(style.opacity) < 0.01) return false;
    node = node.parentElement;
  }
  return true;
}

export function useViewportInView<T extends HTMLElement = HTMLElement>({
  amount = 0.4,
  once = true,
  topInset = 64,
  bottomInset = 64,
  disabled = false,
  requireVisible = false,
}: UseViewportInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }

    setInView(false);
    triggeredRef.current = false;

    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (once && triggeredRef.current) return;

      const rect = el.getBoundingClientRect();
      if (rect.height <= 0 || rect.width <= 0) return;
      if (requireVisible && !isEffectivelyVisible(el)) return;

      const viewportHeight = window.innerHeight;
      const visibleTop = Math.max(rect.top, topInset);
      const visibleBottom = Math.min(rect.bottom, viewportHeight - bottomInset);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const ratio = visibleHeight / rect.height;

      const entered =
        ratio >= amount &&
        rect.bottom > topInset &&
        rect.top < viewportHeight - bottomInset;

      if (entered) {
        setInView(true);
        if (once) triggeredRef.current = true;
      } else if (!once) {
        setInView(false);
      }
    };

    const unsubScroll = subscribeScroll(check);
    const resizeObserver = new ResizeObserver(check);
    resizeObserver.observe(el);

    requestAnimationFrame(check);

    return () => {
      unsubScroll();
      resizeObserver.disconnect();
    };
  }, [amount, bottomInset, disabled, once, requireVisible, topInset]);

  return { ref, inView };
}
