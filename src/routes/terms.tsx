import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { MobileMenu } from "@/components/MobileMenu";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  const navItems = [
    { href: "/#services", label: "Services" },
    { href: "/#features", label: "Features" },
    { href: "/#reviews", label: "Reviews" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen text-foreground flex flex-col">
      {/* Nav */}
      <Reveal variant="fadeIn" as="header" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/40 border-b border-border safe-top">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">FMG</Link>
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

      {/* Main content */}
      <main className="flex-1 pt-28 md:pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h1 className="font-bold mb-6" style={{ fontSize: "clamp(32px, 6vw, 56px)", letterSpacing: "-0.02em" }}>
              Terms of Service
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card/40 p-8 text-muted-foreground leading-relaxed space-y-4">
              <p className="text-sm font-medium text-foreground/60 uppercase tracking-widest">Last updated: [DATE]</p>
              <p className="text-base text-foreground/80">
                These Terms of Service govern your use of FMG's services (a brand of Liantaud Holdings LLC). Full terms will be added shortly.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border text-center text-sm text-muted-foreground">
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
    </div>
  );
}
