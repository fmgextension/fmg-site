import { useEffect, useRef } from "react";

const BUTTON_SELECTOR = ".btn-primary, .btn-secondary";

function getRippleLayer(): HTMLElement {
  let layer = document.getElementById("btn-ripple-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "btn-ripple-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden;";
    document.body.appendChild(layer);
  }
  return layer;
}

function spawnRipple(button: HTMLElement, clientX: number, clientY: number) {
  const layer = getRippleLayer();
  const ripple = document.createElement("span");
  const isPrimary = button.classList.contains("btn-primary");
  ripple.className = `btn-ripple ${isPrimary ? "is-primary" : "is-secondary"}`;
  const size = Math.max(button.offsetWidth, button.offsetHeight) * 2.5;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${clientX - size / 2}px`;
  ripple.style.top = `${clientY - size / 2}px`;
  layer.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

export function ButtonEffects() {
  const pressedButton = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchDevice = window.matchMedia("(hover: none)");

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const button = (event.target as Element).closest(BUTTON_SELECTOR) as HTMLElement | null;
      if (!button) return;

      if (!reducedMotion.matches) {
        spawnRipple(button, event.clientX, event.clientY);
      }

      if (touchDevice.matches || event.pointerType === "touch") {
        pressedButton.current?.classList.remove("is-pressed");
        pressedButton.current = button;
        button.classList.add("is-pressed");
      }
    };

    const clearPressed = () => {
      pressedButton.current?.classList.remove("is-pressed");
      pressedButton.current = null;
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", clearPressed);
    document.addEventListener("pointercancel", clearPressed);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", clearPressed);
      document.removeEventListener("pointercancel", clearPressed);
      clearPressed();
      document.getElementById("btn-ripple-layer")?.remove();
    };
  }, []);

  return null;
}
