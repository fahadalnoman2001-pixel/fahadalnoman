import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Globe, Zap } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { Contact } from "@/components/portfolio/Contact";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { useSeo } from "@/hooks/use-seo";

export function ContactPage() {
  useSeo({
    title: "Contact Fahad Al Noman — Hire a Full-Stack Developer in Malta",
    description:
      "Get in touch with Fahad Al Noman for freelance web development, Laravel and React projects, DevOps and Docker deployments, SEO audits, and Google Ads campaigns. Based in Qormi, Malta — available worldwide.",
    path: "/contact",
  });

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <FloatingOrbs />
      <Nav />

      <main className="pt-28 pb-8">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            animate="show"
            className="space-y-10"
          >
            {/* Page Header */}
            <motion.div variants={fadeUp} className="border-b border-border pb-8">
              <Link
                to="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </Link>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                ▸ Contact
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Let's talk.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Whether you're planning a new build, need someone to take over an existing project,
                or want an SEO audit — send me a message. I read every enquiry personally and
                usually reply the same day.
              </p>
            </motion.div>

            {/* Quick facts */}
            <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Response time
                </div>
                <div className="mt-1 font-display text-sm font-semibold text-foreground">
                  Within 24 hours
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Monday to Saturday, faster during Malta business hours (CET / CEST).
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Working with
                </div>
                <div className="mt-1 font-display text-sm font-semibold text-foreground">
                  Clients worldwide
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Based in Malta. Have delivered projects across the EU, UK, US, Canada, Australia,
                  and Bangladesh.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Availability
                </div>
                <div className="mt-1 font-display text-sm font-semibold text-foreground">
                  Freelance &amp; contract
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Open to short one-off builds and long-term retainer engagements.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Reuse the full contact section — form + contact details */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
