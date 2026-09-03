import { useState } from "react";
import { Mail, Linkedin, Send, Loader2, Check } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { NAV_LINKS, CONTACT, AVATAR_URL } from "./data";
import { subscribeNewsletter } from "@/api/client";

export function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const getLinkHref = (id: string) => {
    return isHomePage ? `#${id}` : `/#${id}`;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await subscribeNewsletter(email.trim());
      toast.success(res.message || "Thank you for subscribing to my newsletter!");
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err: any) {
      toast.error(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border bg-surface/40 py-12">
      {/* ── Newsletter Subscription Section ── */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-10 border-b border-border/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="max-w-md space-y-1.5">
            <div className="flex items-center gap-2 text-accent font-mono text-[11px] uppercase tracking-wider">
              <Mail className="h-3.5 w-3.5" />
              <span>Newsletter & Engineering Notes</span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground">
              Stay in the loop.
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Occasional deep dives on Laravel architecture, DevOps, React 19, and full-stack performance. No spam, unsubscribe anytime.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:max-w-md">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1.5 focus-within:border-accent transition-colors shadow-xs">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email..."
                className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={submitting || subscribed}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : subscribed ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Main Navigation and Branding ── */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img
            src={AVATAR_URL}
            alt="Fahad Al Noman"
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-accent/30"
          />
          <div>
            <div className="font-display text-sm font-semibold text-foreground">Fahad Al Noman</div>
            <div className="font-mono text-[11px] text-muted-foreground">Full-Stack Dev + DevOps · Worldwide</div>
          </div>
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {NAV_LINKS.map((l) => (
            l.path ? (
              <Link key={l.id} to={l.path} className="transition-colors hover:text-accent">
                {l.label}
              </Link>
            ) : (
              <a key={l.id} href={getLinkHref(l.id)} className="transition-colors hover:text-accent">
                {l.label}
              </a>
            )
          ))}
          <Link to="/blog" className="transition-colors hover:text-accent">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            aria-label="Email"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-5 font-mono text-[11px] text-muted-foreground sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>© 2026 Fahad Al Noman. All rights reserved.</div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-wider text-muted-foreground/60">
          <Link to="/about" className="transition-colors hover:text-accent">About</Link>
          <Link to="/faq" className="transition-colors hover:text-accent">FAQ</Link>
          <Link to="/contact" className="transition-colors hover:text-accent">Contact</Link>
          <Link to="/terms" className="transition-colors hover:text-accent">Terms of Service</Link>
          <Link to="/privacy" className="transition-colors hover:text-accent">Privacy Policy</Link>
          <Link to="/sitemap" className="transition-colors hover:text-accent">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
