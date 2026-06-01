import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  notifyScroll,
  scheduleScrollRefresh,
  setLenisInstance,
} from "@/lib/lenis-scroll";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenisInstance(lenis);

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      notifyScroll();
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    scheduleScrollRefresh();
    const onLoad = () => scheduleScrollRefresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
