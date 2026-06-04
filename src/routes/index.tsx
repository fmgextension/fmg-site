import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { CascadeText } from "@/components/CascadeText";
import { HeroScrollSection } from "@/components/HeroScrollSection";
import { VIDEO_CLIPS, VideoBand } from "@/components/VideoBand";
import { CtaSection } from "@/components/CtaSection";
import { FiberGrabTransition } from "@/components/FiberGrabTransition";
import { SectionTransitions } from "@/components/SectionTransitions";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Reveal } from "@/components/Reveal";
import { StaggerGroup } from "@/components/StaggerGroup";
import { InteractiveCard } from "@/components/InteractiveCard";
import { MobileMenu } from "@/components/MobileMenu";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { RevenuePie } from "@/components/RevenuePie";
import { ResultsScatter } from "@/components/ResultsScatter";
import { ProcessFlow } from "@/components/ProcessFlow";
import { MagneticButton } from "@/components/MagneticButton";
import {
  Play,
} from "lucide-react";
import {
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
  const heroScroll = !reduced;
  return (
    <div className="min-h-screen text-foreground">
      <SectionTransitions />
      <ScrollProgress />
      {/* Nav */}
      <Reveal variant="fadeIn" as="header" className="hidden md:block fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/40 border-b border-border safe-top">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">FMG</div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navItems.map((it) => (
              <a key={it.href} href={it.href} className="nav-link">{it.label}</a>
            ))}
          </nav>
          <a href="https://api.leadconnectorhq.com/widget/booking/GY7Wbc5EGo5NME2j6v9T" target="_blank" rel="noopener noreferrer" className="btn-primary hidden md:inline-flex px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            <span className="btn-label">Book a Free Meeting</span>
          </a>
          <MobileMenu items={navItems} ctaHref="tel:+17755464533" ctaLabel="Test Drive Our AI" />
        </div>
      </Reveal>

      {/* Hero + ProcessFlow share one fiber-optic video backdrop. The sticky+negative-margin
          pattern locks one <video> to the viewport for the entire region, then lets it scroll
          out exactly as ProcessFlow ends — one decode for two sections, and no seam between them. */}
      <style>{`
        .fiber-zone { position: relative; isolation: isolate; }
        .fiber-shared {
          position: sticky; top: 0;
          height: 100vh; width: 100%;
          margin-bottom: -100vh;
          z-index: 0; pointer-events: none;
          background: #070A0F; overflow: hidden;
        }
        .fiber-shared video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .fiber-grade {
          position: sticky; top: 0;
          height: 100vh; width: 100%;
          margin-bottom: -100vh;
          z-index: 0; background: rgba(7,10,15,var(--fiber-grade-alpha,.15));
          pointer-events: none;
        }
      `}</style>
      <div className="fiber-zone">
        <div className="fiber-shared" aria-hidden="true">
          <video
            src="/blue%20fiber%20optic%20cables.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
        <div className="fiber-grade" aria-hidden="true" />
        <HeroScrollSection active={heroScroll}>
          <></>
        </HeroScrollSection>
        <ProcessFlow />
      </div>

      <ResultsScatter />

      {/* Services */}
      <section id="services" data-crossfade className="relative overflow-x-hidden overflow-y-visible py-16 md:py-24">
        <div className="relative z-[1] max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <Reveal><div className="text-sm text-primary font-medium mb-3">Our Services</div></Reveal>
            <CascadeText
              as="h2"
              delay={0.1}
              className="font-bold mb-4"
              style={{ fontSize: "clamp(28px, 6vw, 48px)" }}
              segments={[
                { text: "Everything Your Business Needs to" },
                { text: "Grow", style: { color: "hsl(var(--primary))" } },
              ]}
            />
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

      <VideoBand clip={VIDEO_CLIPS.alwaysAnswering} lightOverlay>
        <Reveal delay={0.2}>
          <h1 className="font-semibold leading-tight mb-6" style={{ fontSize: "clamp(32px, 8vw, 72px)", letterSpacing: "-0.02em" }}>
            24/7 AI Receptionist
            <br />
            <span style={{ color: "hsl(var(--primary))" }}>on Standby</span>
          </h1>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Built to answer the calls you're missing right now. FMG.
          </p>
        </Reveal>
        <StaggerGroup tight className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 mb-10 md:mb-12">
          <Reveal delay={0.5}>
            <MagneticButton href="tel:+17755464533" className="btn-primary inline-flex w-full sm:w-auto items-center justify-center px-6 h-12 rounded-full bg-primary text-primary-foreground font-medium">
              <span className="btn-label">Test Drive Our AI</span>
            </MagneticButton>
          </Reveal>
          <Reveal delay={0.55}>
            <button type="button" onClick={() => setVideoOpen(true)} className="btn-secondary relative z-10 inline-flex w-full sm:w-auto items-center justify-center px-6 h-12 rounded-full border border-border bg-transparent text-foreground font-medium touch-manipulation">
              <span className="btn-label inline-flex items-center justify-center gap-2">
                <Play className="w-4 h-4 btn-icon" />
                Watch Demo
              </span>
            </button>
          </Reveal>
        </StaggerGroup>
      </VideoBand>

      {/* Features — RevenuePie owns its own pinned scroll + heading.
          No data-crossfade here: an opacity melt over the 640vh pin would
          look broken and can disturb the sticky pin. */}
      <section
        id="features"
        className="px-6"
        style={{ paddingTop: "clamp(80px, 12vw, 120px)", paddingBottom: "clamp(80px, 12vw, 120px)" }}
      >
        <div className="max-w-7xl mx-auto">
          <RevenuePie />
        </div>
      </section>

      {/* Testimonials -> CTA "fiber grab-and-pull" transition. #reviews is the
          pinned content layer inside the sticky stage so the grab can yank it
          away; one shared fiber video spans the zone to the page bottom; the CTA
          holds full-screen so the footer only appears on deliberate extra scroll. */}
      <FiberGrabTransition
        reviews={
          <section id="reviews" className="py-16 md:py-24 md:px-6 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 px-6 md:px-0">
            <Reveal><div className="text-sm text-primary font-medium mb-3">Testimonials</div></Reveal>
            <CascadeText
              as="h2"
              delay={0.1}
              className="font-bold mb-4"
              style={{ fontSize: "clamp(28px, 6vw, 48px)" }}
              segments={[
                { text: "Loved", style: { color: "hsl(var(--primary))" } },
                { text: "by 50+ Businesses" },
              ]}
            />
            <Reveal delay={0.2}>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients say about working with FMG.
              </p>
            </Reveal>
          </div>
          <StaggerGroup className="testimonials-grid hidden md:grid md:grid-cols-3 gap-6 px-6 md:px-0 items-stretch">
            {[
              { quote: "The AI receptionist captures every call, even after hours. We went from missing calls on weekends to booking jobs around the clock. Game changer for a service business.", initials: "RR", name: "Owner-Operator", role: "Roofing & Restoration, Florida" },
              { quote: "The automated review system pulled our Google rating up fast. New leads find us at the top of the local pack now — and the inbound calls all get answered. The infrastructure speaks for itself.", initials: "CD", name: "Practice Manager", role: "Cosmetic Dental, Southeast US" },
              { quote: "Combining the AI receptionist with their lead capture flow doubled our booked consultations in 60 days. The website they built actually converts — first one we've had that does.", initials: "MS", name: "Founder", role: "Med Spa Network, Multi-Location" },
            ].map((t) => (
              <Reveal key={t.name} className="h-full min-h-0 flex flex-col">
                <InteractiveCard showArrow={false} className="rounded-2xl h-full min-h-[320px] flex flex-col">
                  <div className="p-8 flex flex-col flex-1 min-h-0 bg-card rounded-2xl">
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
              {["Google Partner", "Meta Certified", "HubSpot", "Salesforce"].map((b) => (
                <Reveal key={b}><div className="text-base md:text-lg font-semibold">{b}</div></Reveal>
              ))}
            </StaggerGroup>
          </div>
        </div>
          </section>
        }
        cta={<CtaSection />}
        footer={
          <footer className="relative z-[1] py-10 px-6 text-center text-sm text-muted-foreground">
            <div className="max-w-3xl mx-auto space-y-4">
              <p>© {new Date().getFullYear()} FMG. All rights reserved.</p>
              <p>FMG is a brand of Liantaud Holdings LLC, a Florida limited liability company.</p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <Link to="/privacy" className="hover:text-foreground transition-colors underline-offset-2 hover:underline">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-foreground transition-colors underline-offset-2 hover:underline">Terms of Service</Link>
              </div>
              <p className="text-xs leading-relaxed opacity-70 max-w-2xl mx-auto">
                By providing your phone number on this site or to FMG representatives, you consent to receive SMS messages from FMG regarding appointments, follow-ups, and service updates. Message and data rates may apply. Reply STOP to opt out at any time. Reply HELP for help. Message frequency varies. See our{" "}
                <Link to="/privacy" className="underline">Privacy Policy</Link> for details.
              </p>
            </div>
          </footer>
        }
      />

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
  { quote: "The AI receptionist captures every call, even after hours. We went from missing calls on weekends to booking jobs around the clock. Game changer for a service business.", initials: "RR", name: "Owner-Operator", role: "Roofing & Restoration, Florida" },
  { quote: "The automated review system pulled our Google rating up fast. New leads find us at the top of the local pack now — and the inbound calls all get answered. The infrastructure speaks for itself.", initials: "CD", name: "Practice Manager", role: "Cosmetic Dental, Southeast US" },
  { quote: "Combining the AI receptionist with their lead capture flow doubled our booked consultations in 60 days. The website they built actually converts — first one we've had that does.", initials: "MS", name: "Founder", role: "Med Spa Network, Multi-Location" },
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
            className="snap-center shrink-0 w-[85%] rounded-2xl bg-card border border-border overflow-hidden"
          >
            <InteractiveCard showArrow={false} className="rounded-2xl bg-card">
              <div className="p-6 flex flex-col h-full bg-card rounded-2xl">
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

