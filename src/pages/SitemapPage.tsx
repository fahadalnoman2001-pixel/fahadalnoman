import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, BookOpen, FileText, ShieldAlert, FileSignature, Compass } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { NAV_LINKS } from "@/components/portfolio/data";
import { useSeo } from "@/hooks/use-seo";

export function SitemapPage() {
  useSeo({
    title: "Sitemap — Fahad Al Noman",
    description:
      "Sitemap index for Fahad Al Noman's portfolio. Discover navigation links for work, blog posts, services, and legal policies.",
    path: "/sitemap",
  });

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <FloatingOrbs />
      <Nav />

      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            animate="show"
            className="space-y-12"
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
                ▸ Navigational Structure
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Sitemap
              </h1>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                Website paths index map
              </p>
            </motion.div>

            {/* Sitemap Grid */}
            <motion.div variants={fadeUp} className="grid gap-8 md:grid-cols-2">
              
              {/* Main Pages */}
              <div className="rounded-2xl border border-border bg-surface/30 p-6 space-y-4 shadow-glow-sm">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <Compass className="h-4 w-4 text-accent" />
                  Core Pages
                </h2>
                <ul className="space-y-3 font-sans text-sm">
                  <li>
                    <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                      <Home className="h-3.5 w-3.5" />
                      <span>Home Portfolio Page</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                      <Compass className="h-3.5 w-3.5" />
                      <span>About Fahad Al Noman</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Services &amp; Pricing</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Frequently Asked Questions (FAQ)</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Blog Articles Listing</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                      <FileSignature className="h-3.5 w-3.5" />
                      <span>Terms of Service</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Privacy Policy</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Homepage Sections */}
              <div className="rounded-2xl border border-border bg-surface/30 p-6 space-y-4 shadow-glow-sm">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <FileText className="h-4 w-4 text-accent" />
                  Portfolio Sections
                </h2>
                <ul className="space-y-3 font-sans text-sm">
                  {NAV_LINKS.map((link) => (
                    <li key={link.id}>
                      <a
                        href={`/#${link.id}`}
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
                      >
                        <span className="font-mono text-[10px] text-accent/60">▸</span>
                        <span>{link.label} Section</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* XML Link Info */}
            <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface/20 p-5 text-center">
              <p className="text-xs text-muted-foreground">
                Looking for the search engine XML index? 
                {" "}
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-accent hover:underline"
                >
                  /sitemap.xml
                </a>
              </p>
            </motion.div>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
