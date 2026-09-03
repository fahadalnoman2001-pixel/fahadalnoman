import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Linkedin, Github, Twitter, BookOpen, Terminal, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { useSeo } from "@/hooks/use-seo";
import { EXPERIENCE, SKILL_GROUPS, CERTIFICATIONS, CONTACT, AVATAR_URL } from "@/components/portfolio/data";

export function AboutPage() {
  useSeo({
    title: "About Fahad Al Noman — Full-Stack Developer & DevOps Engineer in Malta",
    description:
      "Learn about Fahad Al Noman — a full-stack developer and DevOps engineer based in Qormi, Malta. Six years building marketplaces, deploying cloud infrastructure, and writing technical guides on Laravel, React, and Docker.",
    path: "/about",
    keywords: [
      "Fahad Al Noman",
      "Full-Stack Developer Malta",
      "DevOps Engineer Malta",
      "Laravel Developer",
      "React Next.js Engineer",
      "Docker VPS Deployment",
      "Technical SEO Consultant",
    ],
    customSchema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": "https://fahadalnoman.com/about#person",
          "name": "Fahad Al Noman",
          "jobTitle": "Full-Stack Developer & DevOps Engineer",
          "url": "https://fahadalnoman.com/about",
          "image": "https://fahadalnoman.com/avatar_v2.jpg",
          "email": "mailto:hello@fahadalnoman.com",
          "sameAs": [
            "https://www.linkedin.com/in/fahad-al-noman-555039411/",
            "https://github.com/fahadnomanofficial",
            "https://x.com/fahadalnoman"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Qormi",
            "addressCountry": "MT"
          },
          "areaServed": "Malta",
          "knowsAbout": [
            "Full-Stack Web Development",
            "Laravel & PHP",
            "React & Next.js",
            "DevOps & Docker",
            "PostgreSQL & Database Optimization",
            "Linux Server Administration",
            "Technical SEO & Digital Marketing"
          ]
        },
        {
          "@type": "AboutPage",
          "@id": "https://fahadalnoman.com/about#webpage",
          "url": "https://fahadalnoman.com/about",
          "name": "About Fahad Al Noman — Full-Stack Developer & DevOps Engineer in Malta",
          "description": "Learn about Fahad Al Noman — a full-stack developer and DevOps engineer based in Qormi, Malta. Six years of experience building marketplaces, deploying production infrastructure, and growing organic traffic.",
          "mainEntity": {
            "@id": "https://fahadalnoman.com/about#person"
          },
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://fahadalnoman.com/#website",
            "name": "Fahad Al Noman",
            "url": "https://fahadalnoman.com"
          }
        }
      ]
    }
  });

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <FloatingOrbs />
      <Nav />

      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
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
                ▸ About
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                About Fahad Al Noman
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  Qormi, Malta · Available worldwide
                </span>
                <span className="hidden sm:inline text-border">·</span>
                <span className="font-mono text-xs">Last updated: August 31, 2026</span>
              </div>
            </motion.div>

            {/* Intro with Headshot */}
            <motion.div variants={fadeUp} className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center">
              <div className="flex-1 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  I'm <strong className="text-foreground font-medium">Fahad Al Noman</strong>, a full-stack developer and DevOps engineer based in Qormi, Malta. Over the last six years, I have engineered production web applications end-to-end — from dynamic, accessible React and Next.js user interfaces to robust Laravel APIs, hardened Linux servers, and tuned PostgreSQL databases.
                </p>
                <p>
                  My engineering philosophy bridges deep software architecture with real-world business impact. I don't stop at committing code; I configure CI/CD pipelines, containerize microservices with Docker, run technical SEO audits, and scale organic reach to ensure products perform reliably under real user demand.
                </p>
                <p>
                  Currently, I serve as the <strong className="text-foreground font-medium">Marketing &amp; Technology Coordinator at Prochimps LTD</strong> in Santa Venera, Malta, and actively collaborate with independent clients and businesses worldwide for full-stack builds, infrastructure setups, and technical consulting.
                </p>
              </div>
              <div className="relative shrink-0">
                <img
                  src={AVATAR_URL}
                  alt="Portrait headshot of Fahad Al Noman"
                  width={160}
                  height={160}
                  className="h-32 w-32 rounded-2xl object-cover ring-1 ring-accent/30 shadow-glow-sm sm:h-40 sm:w-40"
                />
                <div className="absolute -bottom-2 -right-2 rounded-lg bg-surface border border-border px-2 py-0.5 font-mono text-[10px] text-accent">
                  Malta, EU
                </div>
              </div>
            </motion.div>

            {/* Social & Professional Profiles */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-surface/70 p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Connect &amp; Follow</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Explore open-source repositories, connect on professional networks, or follow technical updates:
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://github.com/fahadnomanofficial"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-accent/50 hover:text-accent"
                >
                  <Github className="h-4 w-4 text-accent" />
                  GitHub [github.com/fahadnomanofficial]
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-accent/50 hover:text-accent"
                >
                  <Linkedin className="h-4 w-4 text-accent" />
                  LinkedIn [fahad-al-noman]
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href="https://x.com/fahadalnoman"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-accent/50 hover:text-accent"
                >
                  <Twitter className="h-4 w-4 text-accent" />
                  X / Twitter [@fahadalnoman]
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </motion.div>

            {/* What this Blog Covers */}
            <motion.div variants={fadeUp} className="space-y-4">
              <div className="flex items-center gap-2 text-accent font-mono text-[11px] uppercase tracking-wider">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Editorial Focus</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground">What This Blog Covers</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This blog is a personal developer journal documenting hands-on engineering solutions, architecture breakdowns, and hard-earned lessons from deploying and maintaining production systems.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Terminal className="h-4 w-4 text-accent" />
                    <span>Full-Stack &amp; Architecture</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Production patterns in Laravel 11 (PHP 8.4), React 19, Next.js, PostgreSQL schema design, query optimization, and REST API development.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>DevOps &amp; Infrastructure</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Docker containerization, Linux VPS administration, Nginx reverse proxies, SSL automation, automated backups, and server security hardening.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>Technical SEO &amp; Performance</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Core Web Vitals tuning, Schema.org JSON-LD structured data, AI crawler extractability (GEO / AI-SEO), and organic growth strategy.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span>Freelance &amp; Engineering Notes</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Real client case studies, lessons from launching multi-million-visit marketplaces, and practical workflows for modern software engineers.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Work Experience */}
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">Work Experience</h2>
              <div className="space-y-6">
                {EXPERIENCE.map((exp) => (
                  <div
                    key={`${exp.company}-${exp.period}`}
                    className="rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/30"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {exp.role}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                        {exp.period}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{exp.company}</p>
                    <ul className="mt-4 list-inside list-disc space-y-1.5 pl-2 text-sm leading-relaxed text-muted-foreground">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills & Tech Stack */}
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Skills &amp; Technology Stack
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {SKILL_GROUPS.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      {group.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Certifications
              </h2>
              <ul className="space-y-2">
                {CERTIFICATIONS.map((cert) => (
                  <li
                    key={cert.name}
                    className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm"
                  >
                    <div>
                      <span className="font-medium text-foreground">{cert.name}</span>
                      <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                        · {cert.issuer}
                      </span>
                    </div>
                    {cert.url && cert.url !== "#" && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] text-accent hover:underline"
                      >
                        View certificate →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center"
            >
              <h2 className="font-display text-xl font-semibold text-foreground">
                Let's Build Something Together
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Available for select freelance engagements, contract development, infrastructure audits, and technical SEO advisory.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow-sm transition-transform hover:scale-[1.03]"
                >
                  Contact me
                </Link>
                <a
                  href="mailto:hello@fahadalnoman.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" />
                  hello@fahadalnoman.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
