import { Reveal } from "@/components/Reveal";

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/GY7Wbc5EGo5NME2j6v9T";

export function CtaSection() {
  return (
    <section
      id="contact"
      className="cta-section relative overflow-hidden py-16 md:py-24 px-6"
      data-video
    >
      <div className="cta-section-content cta-section-panel relative z-[1] max-w-4xl mx-auto text-center p-8 md:p-12">
        <Reveal>
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px, 7vw, 48px)" }}>
            Ready to <span style={{ color: "hsl(var(--primary))" }}>Transform</span> Your Business?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 50+ businesses already using FMG to capture more leads, earn more reviews, and grow
            faster. Let&apos;s talk about your goals.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center px-6 h-12 rounded-full bg-primary text-primary-foreground font-medium w-full sm:w-auto"
            >
              <span className="btn-label">Get your free audit</span>
            </a>
            <a
              href="tel:+17866347595"
              className="btn-secondary inline-flex items-center justify-center px-6 h-12 rounded-full border border-border bg-transparent text-foreground font-medium w-full sm:w-auto"
            >
              <span className="btn-label">Test Drive Our AI</span>
            </a>
          </div>
        </Reveal>
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
          <a href="tel:+17866347595" className="text-link">
            786-634-7595
          </a>
          <a href="mailto:info@fmgfirm.com" className="text-link">
            info@fmgfirm.com
          </a>
        </div>
      </div>
    </section>
  );
}
