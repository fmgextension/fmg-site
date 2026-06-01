import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

type Item = { href: string; label: string };

export function MobileMenu({ items, ctaHref, ctaLabel }: { items: Item[]; ctaHref: string; ctaLabel: string }) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (open) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="icon-btn md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-foreground"
      >
        {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
      </button>

      {mounted && createPortal(
        <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 md:hidden flex flex-col safe-top safe-bottom"
            style={{
              backgroundColor: "hsl(218 36% 4%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex justify-end p-4" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="icon-btn inline-flex items-center justify-center w-11 h-11 text-foreground"
              >
                <X size={24} weight="bold" />
              </button>
            </div>
            <div
              className="flex-1 flex flex-col justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center text-foreground border-b border-border"
                  style={{ padding: "16px 24px", minHeight: 44, fontSize: 18, fontWeight: 500 }}
                >
                  {it.label}
                </a>
              ))}
            </div>
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <a
                href={ctaHref}
                {...(ctaHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => setOpen(false)}
                className="btn-primary flex items-center justify-center w-full h-12 rounded-full bg-primary text-primary-foreground font-medium"
              >
                <span className="btn-label">{ctaLabel}</span>
              </a>
            </div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default MobileMenu;