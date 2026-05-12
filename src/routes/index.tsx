import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { EASE_IN_OUT } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { StaggerGroup } from "@/components/StaggerGroup";
import { InteractiveCard } from "@/components/InteractiveCard";
import { MobileMenu } from "@/components/MobileMenu";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { RevenueConstellation, type NodeKey } from "@/components/RevenueConstellation";
import { HeroPhoneMockup } from "@/components/HeroPhoneMockup";
import { WaveTexture } from "@/components/WaveTexture";
import {
  ArrowRight,
  Play,
} from "lucide-react";
import {
  ArrowRight as PArrowRight,
  Star as PStar,
  Globe as PGlobe,
  PhoneCall as PPhoneCall,
  Lightning as PLightning,
  X as PX,
} from "@phosphor-icons/react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [videoOpen, setVideoOpen] = useState(false);
  const reduced = useReducedMotion();
  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#features", label: "Features" },
    { href: "#reviews", label: "Reviews" },
    { href: "#contact", label: "Contact" },
  ];
  const heroFloat = reduced
    ? {}
    : { y: [0, -8, 0], rotate: [0, 0.5, 0] };
  const cardFloat = reduced ? {} : { y: [0, -4, 0] };
  const dotPulse = reduced ? {} : { scale: [1, 1.15, 1], opacity: [1, 0.7, 1] };
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <Reveal variant="fadeIn" as="header" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/40 border-b border-border safe-top">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">FMG</div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navItems.map((it) => (
              <a key={it.href} href={it.href} className="nav-link">{it.label}</a>
            ))}
          </nav>
          <a href="https://bit.ly/bookingfmg" target="_blank" rel="noopener noreferrer" className="btn-primary hidden md:inline-flex px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            Book a Demo
          </a>
          <MobileMenu items={navItems} ctaHref="https://bit.ly/bookingfmg" ctaLabel="Book a Demo" />
        </div>
      </Reveal>

      {/* Hero */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 px-6" style={{ background: "var(--gradient-hero)" }}>
        <WaveTexture variant="hero" />
        <div className="relative z-[1] max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="order-1">
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/40 text-sm mb-6">
                <motion.span
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={dotPulse}
                  transition={{ duration: 2, ease: EASE_IN_OUT, repeat: Infinity }}
                />
                <span>Powered by Advanced AI</span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="font-semibold leading-tight mb-6" style={{ fontSize: "clamp(32px, 8vw, 72px)", letterSpacing: "-0.02em" }}>
                24/7 AI Receptionist
                <br />
                <span style={{ color: "hsl(var(--primary))" }}>on Standby</span>
              </h1>
            </Reveal>
            <Reveal delay={0.35}>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl">
                Built to answer the calls you're missing right now. FMG.
              </p>
            </Reveal>
            <StaggerGroup tight className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-10 md:mb-12">
              <Reveal delay={0.5}>
                <a href="tel:+17866347595" className="btn-primary inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 h-12 rounded-full bg-primary text-primary-foreground font-medium">
                  Test Drive Our AI <ArrowRight className="w-4 h-4 btn-arrow" />
                </a>
              </Reveal>
              <Reveal delay={0.55}>
                <button type="button" onClick={() => setVideoOpen(true)} className="btn-secondary relative z-10 inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 h-12 rounded-full border border-border bg-transparent text-foreground font-medium touch-manipulation">
                  <Play className="w-4 h-4 btn-icon" /> Watch Demo
                </button>
              </Reveal>
            </StaggerGroup>
            <StaggerGroup tight className="grid grid-cols-3 gap-4 md:gap-6 max-w-md">
              {[
                { n: "500+", l: "Businesses Served" },
                { n: "10k+", l: "Calls Handled Daily" },
                { n: "4.9★", l: "Average Review Score" },
              ].map((s, i) => (
                <Reveal key={s.l} delay={0.7 + i * 0.06}>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{s.n}</div>
                    <div className="text-[13px] md:text-xs text-muted-foreground mt-1 uppercase" style={{ fontWeight: 500, letterSpacing: "0.05em" }}>{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </StaggerGroup>
          </div>
          <div className="order-2 flex flex-col gap-4">
            <Reveal variant="scaleIn" delay={0.3} className="relative">
              <div className="absolute -inset-4 rounded-3xl blur-3xl opacity-30 bg-primary" />
              <motion.div
                className="relative [--phone-max:240px] lg:[--phone-max:320px]"
                animate={heroFloat}
                transition={{ duration: 6, ease: EASE_IN_OUT, repeat: Infinity, repeatType: "loop", delay: 1.5 }}
              >
                <HeroPhoneMockup />
                <Reveal variant="fadeUp" delay={0.9} className="hidden lg:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-[320px] max-w-[90%] z-10">
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-border"
                    animate={cardFloat}
                    transition={{ duration: 4.5, ease: EASE_IN_OUT, repeat: Infinity, delay: 2 }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>AI</div>
                    <div>
                      <div className="font-semibold text-sm">AI Receptionist Active</div>
                      <div className="text-xs text-muted-foreground">Handling 47 calls right now</div>
                    </div>
                    <motion.span
                      className="ml-auto w-2 h-2 rounded-full bg-primary"
                      animate={dotPulse}
                      transition={{ duration: 2, ease: EASE_IN_OUT, repeat: Infinity }}
                    />
                  </motion.div>
                </Reveal>
              </motion.div>
            </Reveal>
            {/* Mobile-only inline notification card (promoted from overlay) */}
            <Reveal variant="fadeUp" delay={0.5} className="lg:hidden">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>AI</div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">AI Receptionist Active</div>
                  <div className="text-[13px] text-muted-foreground">Handling 47 calls right now</div>
                </div>
                <motion.span
                  className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0"
                  animate={dotPulse}
                  transition={{ duration: 2, ease: EASE_IN_OUT, repeat: Infinity }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative overflow-hidden py-16 md:py-24">
        <WaveTexture variant="services" />
        <div className="relative z-[1] max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <Reveal><div className="text-sm text-primary font-medium mb-3">Our Services</div></Reveal>
            <Reveal delay={0.1}><h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px, 6vw, 48px)" }}>Everything Your Business Needs to Grow</h2></Reveal>
            <Reveal delay={0.2}>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge AI technology with premium design to deliver solutions that actually move the needle.
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.3} className="relative z-[1]">
          <ServicesCarousel
            items={[
              { icon: PPhoneCall, title: "AI Receptionists", desc: "24/7 AI-powered receptionists that answer calls, book appointments, and never miss a lead.", items: ["24/7 Availability", "Natural Conversations", "Appointment Booking", "Lead Capture"] },
              { icon: PStar, title: "5-Star Review Generation", desc: "Automatically collect and boost your Google reviews. Turn happy customers into your best marketing.", items: ["Automated Follow-ups", "Review Monitoring", "Response Templates", "Analytics Dashboard"] },
              { icon: PGlobe, title: "High-End Web Design", desc: "Premium websites that convert visitors into customers. Stunning designs backed by conversion science.", items: ["Custom Design", "Mobile Optimized", "SEO Ready", "Fast Loading"] },
              { icon: PLightning, title: "Increase Lead Flow", desc: "Supercharge your pipeline with AI-driven lead generation. More appointments, more revenue.", items: ["Book More Appts", "Schedule Consultations", "Lead Nurturing", "Pipeline Automation"] },
            ]}
          />
        </Reveal>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-6 border-t border-border"
        style={{ paddingTop: "clamp(80px, 12vw, 120px)", paddingBottom: "clamp(80px, 12vw, 120px)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mx-auto mb-8 lg:mb-12" style={{ maxWidth: 640 }}>
            <Reveal><div className="text-sm text-primary font-medium mb-3">Why Choose Us</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 1.15 }}>
                Built for Businesses That <span style={{ color: "hsl(var(--primary))" }}>Demand Excellence</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base text-muted-foreground">
                Six channels. One revenue engine. Built to compound.
              </p>
            </Reveal>
          </div>

          <RevenueConstellationLayout />
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 md:py-24 md:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 px-6 md:px-0">
            <Reveal><div className="text-sm text-primary font-medium mb-3">Testimonials</div></Reveal>
            <Reveal delay={0.1}><h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px, 6vw, 48px)" }}>Loved by 500+ Businesses</h2></Reveal>
            <Reveal delay={0.2}>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients say about working with FMG.
              </p>
            </Reveal>
          </div>
          <StaggerGroup className="hidden md:grid md:grid-cols-3 gap-6 px-6 md:px-0">
            {[
              { quote: "FMG's AI receptionist has been a game-changer. We went from missing 30% of calls to capturing every single lead. Our reviews jumped from 3.8 to 4.9 stars in just 3 months.", initials: "SM", name: "Sarah Mitchell", role: "Owner, Mitchell Dental" },
              { quote: "The ROI speaks for itself. We've seen a 400% increase in booked appointments and our Google ranking has skyrocketed thanks to the review system.", initials: "DC", name: "David Chen", role: "CEO, Premier Auto Group" },
              { quote: "Not only did they build us a stunning website, but the AI handles our after-hours inquiries perfectly. It's like having a 24/7 sales team.", initials: "JW", name: "Jessica Williams", role: "Director, Luxe Real Estate" },
            ].map((t) => (
              <Reveal key={t.name} className="h-full">
                <InteractiveCard showArrow={false} className="rounded-2xl">
                  <div className="p-8 flex flex-col h-full bg-card">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <PStar key={i} size={16} weight="fill" className="text-primary" />
                      ))}
                    </div>
                    <p className="text-foreground/90 mb-6 flex-1">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-primary bg-secondary">
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
              </Reveal>
            ))}
          </StaggerGroup>
          <TestimonialsCarousel />
          <div className="mt-12 md:mt-16 text-center px-6 md:px-0">
            <Reveal><p className="text-sm text-muted-foreground mb-6">Trusted by leading businesses across industries</p></Reveal>
            <StaggerGroup tight className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-60">
              {["Google Partner", "Meta Certified", "HubSpot", "Salesforce", "Stripe"].map((b) => (
                <Reveal key={b}><div className="text-base md:text-lg font-semibold">{b}</div></Reveal>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative overflow-hidden py-16 md:py-24 px-6 border-t border-border">
        <WaveTexture variant="cta" />
        <div className="relative z-[1] max-w-4xl mx-auto text-center p-8 md:p-12 rounded-3xl border border-border" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
          <Reveal><h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px, 7vw, 48px)" }}>Ready to Transform Your Business?</h2></Reveal>
          <Reveal delay={0.1}>
            <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ businesses already using FMG to capture more leads, earn more reviews, and grow faster. Let's talk about your goals.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4">
              <a href="https://bit.ly/bookingfmg" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-primary text-primary-foreground font-medium w-full sm:w-auto">
                Book a Free Demo <PArrowRight className="btn-arrow" size={16} weight="bold" />
              </a>
              <a href="tel:+17866347595" className="btn-secondary inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full border border-border bg-transparent text-foreground font-medium w-full sm:w-auto">
                Schedule a Call
              </a>
            </div>
          </Reveal>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <a href="tel:+17866347595" className="text-link">786-634-7595</a>
            <a href="mailto:fmg.protocol@gmail.com" className="text-link">fmg.protocol@gmail.com</a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FMG. All rights reserved.
      </footer>

      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-border"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="icon-btn absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-background/80 border border-border"
              aria-label="Close"
            >
              <PX size={16} weight="bold" />
            </button>
            <iframe
              src="https://www.loom.com/embed/59b4eb299cfa4d43bc619ce332cc3f4a?autoplay=1"
              title="FMG Demo"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const TESTIMONIALS = [
  { quote: "FMG's AI receptionist has been a game-changer. We went from missing 30% of calls to capturing every single lead. Our reviews jumped from 3.8 to 4.9 stars in just 3 months.", initials: "SM", name: "Sarah Mitchell", role: "Owner, Mitchell Dental" },
  { quote: "The ROI speaks for itself. We've seen a 400% increase in booked appointments and our Google ranking has skyrocketed thanks to the review system.", initials: "DC", name: "David Chen", role: "CEO, Premier Auto Group" },
  { quote: "Not only did they build us a stunning website, but the AI handles our after-hours inquiries perfectly. It's like having a 24/7 sales team.", initials: "JW", name: "Jessica Williams", role: "Director, Luxe Real Estate" },
];

function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-tcard]");
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const cCenter = c.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(cCenter - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="md:hidden">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 -mx-0"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            data-tcard
            className="snap-center shrink-0 w-[85%]"
          >
            <InteractiveCard showArrow={false} className="rounded-2xl">
              <div className="p-6 flex flex-col h-full bg-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <PStar key={i} size={16} weight="fill" className="text-primary" />
                  ))}
                </div>
                <p className="text-base text-foreground/90 mb-6 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-primary bg-secondary">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-[13px] text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </InteractiveCard>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: i === active
                ? "hsl(var(--primary))"
                : "hsl(var(--muted-foreground) / 0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const FEATURE_BLOCKS: { n: string; title: string; desc: string; mapped: string; key: NodeKey }[] = [
  { n: "01", title: "Lightning Fast Setup", desc: "Get up and running in minutes, not weeks. Our AI learns your business instantly.", mapped: "WEBSITE", key: "website" },
  { n: "02", title: "Enterprise Security", desc: "Bank-level encryption and compliance. Your data is always safe with us.", mapped: "EMAIL", key: "email" },
  { n: "03", title: "Proven ROI", desc: "Average 300% increase in captured leads. Real results, measured in dollars.", mapped: "PAID MEDIA", key: "paid" },
  { n: "04", title: "24/7 Availability", desc: "Never miss a call again. AI that works while you sleep.", mapped: "RECEPTIONIST", key: "ai" },
  { n: "05", title: "Human Handoff", desc: "Seamless transfer to your team when needed. AI + human, perfectly balanced.", mapped: "SOCIAL", key: "social" },
  { n: "06", title: "Real-Time Analytics", desc: "Track every call, review, and conversion. Data-driven decisions made easy.", mapped: "SEO", key: "seo" },
];

function RevenueConstellationLayout() {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const update = (v: number) => {
      const idx = Math.min(
        FEATURE_BLOCKS.length - 1,
        Math.max(0, Math.floor(v * FEATURE_BLOCKS.length)),
      );
      setActiveIndex(idx);
    };
    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress]);

  const activeKey: NodeKey = FEATURE_BLOCKS[activeIndex].key;
  const fadeDur = reduced ? 0 : 0.2;

  const featureBlocks = (
    <>
      {FEATURE_BLOCKS.map((f, i) => {
        const isActive = i === activeIndex;
        return (
          <motion.div
            key={f.n}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: fadeDur, ease: "easeOut" }}
            className="flex flex-col mx-auto w-full"
            style={{
              gridColumn: 1,
              gridRow: 1,
              maxWidth: 480,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "hsl(var(--primary))",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {f.n}
            </div>
            <h3
              style={{
                marginTop: 16,
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                marginTop: 16,
                fontSize: "clamp(15px, 2.4vw, 16px)",
                fontWeight: 400,
                color: "hsl(var(--muted-foreground))",
                lineHeight: 1.6,
              }}
            >
              {f.desc}
            </p>
            <div
              style={{
                marginTop: 24,
                fontSize: 11,
                fontWeight: 600,
                color: "hsl(var(--muted-foreground))",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Mapped to — {f.mapped}
            </div>
          </motion.div>
        );
      })}
    </>
  );

  const dots = (
    <>
      {FEATURE_BLOCKS.map((_, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <span
            key={i}
            style={{
              display: "block",
              width: isActive ? 36 : 24,
              height: 2,
              borderRadius: 1,
              backgroundColor:
                isActive || isPast
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))",
              opacity: isActive ? 1 : isPast ? 0.6 : 0.3,
              transition: reduced
                ? "none"
                : "width 300ms ease-out, opacity 300ms ease-out, background-color 300ms ease-out",
            }}
          />
        );
      })}
    </>
  );

  return (
    <div ref={outerRef} className="rc-outer relative">
      {/* Mobile sticky wrapper: simple top-down block stack, fixed gaps.
          top offset = navbar height so diagram isn't clipped behind fixed nav. */}
      <div
        className="sticky lg:hidden flex flex-col justify-center w-full overflow-hidden"
        style={{ top: 64, height: "calc(100vh - 64px)", paddingTop: 16, paddingBottom: 16 }}
      >
        <div className="mx-auto" style={{ width: "min(280px, 90vw)", flexShrink: 0 }}>
          <RevenueConstellation activeKey={activeKey} compact />
        </div>
        <div className="grid w-full" style={{ marginTop: 24, paddingLeft: 24, paddingRight: 24 }}>
          {featureBlocks}
        </div>
        <div
          className="flex justify-center items-center w-full"
          style={{ marginTop: 32, gap: 6 }}
          aria-hidden="true"
        >
          {dots}
        </div>
      </div>

      {/* Desktop sticky wrapper: original two-column layout */}
      <div className="sticky top-0 h-screen w-full hidden lg:flex lg:flex-col lg:justify-start">
        <div className="flex flex-1 min-h-0 flex-row py-10 gap-12 items-center w-full">
          <div className="flex items-center justify-center w-full h-full flex-[3] min-h-0 shrink">
            <div className="block w-full mx-auto" style={{ maxWidth: 600 }}>
              <RevenueConstellation activeKey={activeKey} />
            </div>
          </div>
          <div className="grid w-full shrink-0 flex-[2] h-full items-center justify-items-center shrink">
            {featureBlocks}
          </div>
        </div>
        <div
          className="flex justify-center items-center w-full shrink-0 h-auto pt-4"
          style={{ gap: 6 }}
          aria-hidden="true"
        >
          {dots}
        </div>
      </div>
    </div>
  );
}
