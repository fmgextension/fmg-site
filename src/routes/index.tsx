import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImage from "@/assets/hero-abstract.jpg";
import { Reveal } from "@/components/Reveal";
import { StaggerGroup } from "@/components/StaggerGroup";
import {
  ArrowRight,
  Play,
  Phone,
  Star,
  Globe,
  TrendingUp,
  Zap,
  Shield,
  DollarSign,
  Clock,
  Users,
  BarChart3,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <Reveal variant="fadeIn" as="header" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">FMG</div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition">Services</a>
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#reviews" className="hover:text-foreground transition">Reviews</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <a href="https://bit.ly/bookingfmg" target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            Book a Demo
          </a>
        </div>
      </Reveal>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/40 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Powered by Advanced AI
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                5-Star Google Reviews on{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-text)" }}>
                  Autopilot
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.35}>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                AI Receptionists that never sleep. High-end web design that converts. We're FMG.
              </p>
            </Reveal>
            <StaggerGroup tight className="flex flex-wrap gap-4 mb-12">
              <Reveal delay={0.5}>
                <a href="tel:+17866347595" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                  Test Drive Our AI <ArrowRight className="w-4 h-4" />
                </a>
              </Reveal>
              <Reveal delay={0.55}>
                <button type="button" onClick={() => setVideoOpen(true)} className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card/40 font-medium hover:bg-card/60 transition cursor-pointer touch-manipulation">
                  <Play className="w-4 h-4" /> Watch Demo
                </button>
              </Reveal>
            </StaggerGroup>
            <StaggerGroup tight className="grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "500+", l: "Businesses Served" },
                { n: "10k+", l: "Calls Handled Daily" },
                { n: "4.9★", l: "Average Review Score" },
              ].map((s, i) => (
                <Reveal key={s.l} delay={0.7 + i * 0.06}>
                  <div>
                    <div className="text-3xl font-bold">{s.n}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </StaggerGroup>
          </div>
          <Reveal variant="scaleIn" delay={0.3} className="relative">
            <div className="absolute -inset-4 rounded-3xl blur-3xl opacity-40" style={{ background: "var(--gradient-text)" }} />
            <div className="relative rounded-3xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-glow)" }}>
              <img src={heroImage} alt="AI Technology" width={1280} height={960} className="w-full h-auto" />
              <Reveal variant="fadeUp" delay={0.9} className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-border">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary-foreground" style={{ background: "var(--gradient-text)" }}>AI</div>
                  <div>
                    <div className="font-semibold text-sm">AI Receptionist Active</div>
                    <div className="text-xs text-muted-foreground">Handling 47 calls right now</div>
                  </div>
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><div className="text-sm text-primary font-medium mb-3">Our Services</div></Reveal>
            <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-bold mb-4">Everything Your Business Needs to Grow</h2></Reveal>
            <Reveal delay={0.2}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge AI technology with premium design to deliver solutions that actually move the needle.
              </p>
            </Reveal>
          </div>
          <StaggerGroup className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Phone, title: "AI Receptionists", desc: "24/7 AI-powered receptionists that answer calls, book appointments, and never miss a lead.", items: ["24/7 Availability", "Natural Conversations", "Appointment Booking", "Lead Capture"] },
              { icon: Star, title: "5-Star Review Generation", desc: "Automatically collect and boost your Google reviews. Turn happy customers into your best marketing.", items: ["Automated Follow-ups", "Review Monitoring", "Response Templates", "Analytics Dashboard"] },
              { icon: Globe, title: "High-End Web Design", desc: "Premium websites that convert visitors into customers. Stunning designs backed by conversion science.", items: ["Custom Design", "Mobile Optimized", "SEO Ready", "Fast Loading"] },
              { icon: TrendingUp, title: "Increase Lead Flow", desc: "Supercharge your pipeline with AI-driven lead generation. More appointments, more revenue.", items: ["Book More Appts", "Schedule Consultations", "Lead Nurturing", "Pipeline Automation"] },
            ].map((s) => (
              <Reveal key={s.title}>
                <div className="p-8 rounded-2xl border border-border hover:border-primary/40 transition group h-full" style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-text)" }}>
                    <s.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground mb-5">{s.desc}</p>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    {s.items.map((i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <Reveal><div className="text-sm text-primary font-medium mb-3">Why Choose Us</div></Reveal>
              <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-bold">Built for Businesses That Demand Excellence</h2></Reveal>
            </div>
            <div className="flex flex-col justify-center">
              <Reveal delay={0.2}>
                <p className="text-muted-foreground mb-6">
                  We don't just build tools—we build growth engines. Every feature is designed to help your business capture more leads, build trust, and scale without limits.
                </p>
              </Reveal>
              <StaggerGroup tight className="grid grid-cols-2 gap-4">
                <Reveal delay={0.3}>
                  <div className="p-4 rounded-xl border border-border" style={{ background: "var(--gradient-card)" }}>
                    <div className="text-3xl font-bold text-primary">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
                  </div>
                </Reveal>
                <Reveal delay={0.36}>
                  <div className="p-4 rounded-xl border border-border" style={{ background: "var(--gradient-card)" }}>
                    <div className="text-3xl font-bold text-primary">&lt;2s</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                </Reveal>
              </StaggerGroup>
            </div>
          </div>
          <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Lightning Fast Setup", desc: "Get up and running in minutes, not weeks. Our AI learns your business instantly." },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption and compliance. Your data is always safe with us." },
              { icon: DollarSign, title: "Proven ROI", desc: "Average 300% increase in captured leads. Real results, measured in dollars." },
              { icon: Clock, title: "24/7 Availability", desc: "Never miss a call again. AI that works while you sleep." },
              { icon: Users, title: "Human Handoff", desc: "Seamless transfer to your team when needed. AI + human, perfectly balanced." },
              { icon: BarChart3, title: "Real-Time Analytics", desc: "Track every call, review, and conversion. Data-driven decisions made easy." },
            ].map((f) => (
              <Reveal key={f.title}>
                <div className="p-6 rounded-2xl border border-border h-full" style={{ background: "var(--gradient-card)" }}>
                  <f.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><div className="text-sm text-primary font-medium mb-3">Testimonials</div></Reveal>
            <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by 500+ Businesses</h2></Reveal>
            <Reveal delay={0.2}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients say about working with FMG.
              </p>
            </Reveal>
          </div>
          <StaggerGroup className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "FMG's AI receptionist has been a game-changer. We went from missing 30% of calls to capturing every single lead. Our reviews jumped from 3.8 to 4.9 stars in just 3 months.", initials: "SM", name: "Sarah Mitchell", role: "Owner, Mitchell Dental" },
              { quote: "The ROI speaks for itself. We've seen a 400% increase in booked appointments and our Google ranking has skyrocketed thanks to the review system.", initials: "DC", name: "David Chen", role: "CEO, Premier Auto Group" },
              { quote: "Not only did they build us a stunning website, but the AI handles our after-hours inquiries perfectly. It's like having a 24/7 sales team.", initials: "JW", name: "Jessica Williams", role: "Director, Luxe Real Estate" },
            ].map((t) => (
              <Reveal key={t.name} className="h-full">
                <div className="p-8 rounded-2xl border border-border flex flex-col h-full" style={{ background: "var(--gradient-card)" }}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/90 mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-primary-foreground" style={{ background: "var(--gradient-text)" }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </StaggerGroup>
          <div className="mt-16 text-center">
            <Reveal><p className="text-sm text-muted-foreground mb-6">Trusted by leading businesses across industries</p></Reveal>
            <StaggerGroup tight className="flex flex-wrap justify-center gap-8 opacity-60">
              {["Google Partner", "Meta Certified", "HubSpot", "Salesforce", "Stripe"].map((b) => (
                <Reveal key={b}><div className="text-lg font-semibold">{b}</div></Reveal>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-border" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
          <Reveal><h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Business?</h2></Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ businesses already using FMG to capture more leads, earn more reviews, and grow faster. Let's talk about your goals.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://bit.ly/bookingfmg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                Book a Free Demo <ArrowRight className="w-4 h-4" />
              </a>
              <a href="tel:+17866347595" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card/40 font-medium hover:bg-card/60 transition">
                Schedule a Call
              </a>
            </div>
          </Reveal>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="tel:+17866347595" className="hover:text-foreground transition">786-634-7595</a>
            <a href="mailto:fmg.protocol@gmail.com" className="hover:text-foreground transition">fmg.protocol@gmail.com</a>
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
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-background/80 hover:bg-background border border-border"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
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
