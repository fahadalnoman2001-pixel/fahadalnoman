import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { useSeo } from "@/hooks/use-seo";

type Service = {
  title: string;
  tag: string;
  summary: string;
  details: string;
  includes: string[];
};

const SERVICE_DETAILS: Service[] = [
  {
    title: "React & Next.js Development",
    tag: "<react/>",
    summary:
      "Modern, high-performance frontends built with React, Next.js, and TypeScript — from marketing sites to complex marketplace UIs.",
    details:
      "I build React and Next.js applications end-to-end: routing, state management, server-side rendering, static generation, and API integrations. Every project ships with type-safe TypeScript, Tailwind or a considered component system, accessibility built in, and Core Web Vitals tuned for search performance.",
    includes: [
      "Custom React / Next.js single-page and server-rendered apps",
      "Component libraries with TypeScript, Tailwind, and shadcn/ui",
      "REST and GraphQL API integrations",
      "Authentication flows and role-based access",
      "Core Web Vitals optimisation and Lighthouse tuning",
    ],
  },
  {
    title: "Laravel Web App Development",
    tag: "<laravel/>",
    summary:
      "Secure Laravel backends with well-designed APIs, database architecture, and admin dashboards.",
    details:
      "I ship production Laravel applications — MVC or API-first — with clean models, migrations, queues, and a proper admin panel. Every backend I build includes CSRF protection, request validation, rate limiting, and automated tests where they matter.",
    includes: [
      "REST API design and OpenAPI documentation",
      "Authentication (Sanctum, Passport, session-based)",
      "Stripe / PayPal / local payment gateway integrations",
      "Custom admin dashboards for content and operations",
      "PostgreSQL and MySQL schema design and optimisation",
    ],
  },
  {
    title: "DevOps, Docker & VPS Management",
    tag: "<devops/>",
    summary:
      "Deploy, containerize, and maintain your production infrastructure on Hostinger, DigitalOcean, or any Linux VPS.",
    details:
      "I've spent years running production apps on Linux VPS environments — hardening SSH, configuring firewalls, containerising services with Docker, and writing Python scripts for automated PostgreSQL backups. Whether you need a one-time deployment or ongoing infrastructure management, I can help.",
    includes: [
      "Server provisioning, SSH key setup, and firewall hardening",
      "Docker and Docker Compose for consistent environments",
      "Automated PostgreSQL / MySQL backups with retention policies",
      "Nginx / Apache reverse proxies with HTTPS via Let's Encrypt",
      "Uptime monitoring and log aggregation",
    ],
  },
  {
    title: "WordPress Development & Maintenance",
    tag: "<wordpress/>",
    summary:
      "Bespoke WordPress themes, WooCommerce stores, plugin customisation, and speed optimisation.",
    details:
      "I build custom WordPress themes from scratch and customise WooCommerce for real e-commerce needs. Sites I deliver load fast, rank well, and stay secure — with proper caching, image optimisation, and regular update cycles.",
    includes: [
      "Custom themes built to your brand and design",
      "WooCommerce setup, payment gateways, and product imports",
      "Plugin customisation and lightweight custom plugins",
      "Speed optimisation (caching, CDN, image compression)",
      "Migration, hosting setup, and ongoing maintenance",
    ],
  },
  {
    title: "SEO for Malta & EU Businesses",
    tag: "<seo/>",
    summary:
      "Technical SEO audits, on-page optimisation, local citations, and content strategy that gets you ranking on Google.",
    details:
      "SEO isn't a checkbox — it's engineering plus content plus patience. I run full technical audits, fix crawl and indexing issues, improve Core Web Vitals, structure your content and internal links, and set you up with Google Search Console and Analytics so you can see what's working.",
    includes: [
      "Full technical SEO audit with prioritised fixes",
      "On-page optimisation: titles, meta, headings, schema markup",
      "Local SEO for Malta and EU targeting (Google Business Profile, citations)",
      "Content strategy and keyword research",
      "Ongoing performance reporting from Google Search Console",
    ],
  },
  {
    title: "Google Ads & Digital Marketing",
    tag: "<ads/>",
    summary:
      "Google Ads and paid social campaigns focused on real conversions, not just clicks.",
    details:
      "I ran the paid campaigns that drove 5M+ visits to bdproperty.xyz. I set up conversion tracking properly, structure campaigns around search intent, write ads that get clicks, and iterate on landing pages until CPA comes down.",
    includes: [
      "Google Ads account setup, campaign structure, and keyword research",
      "Conversion tracking via GA4 and Google Tag Manager",
      "Meta (Facebook / Instagram) campaign setup and audience targeting",
      "Landing page copy, A/B testing, and conversion rate optimisation",
      "Monthly performance reports with clear next steps",
    ],
  },
  {
    title: "UI / UX Design",
    tag: "<design/>",
    summary:
      "Clean, modern interface design focused on conversions and clarity, not decoration.",
    details:
      "I design interfaces that get out of the user's way. Every screen starts from what the user is trying to accomplish, uses a consistent design system, and is tested at real device sizes before code is written.",
    includes: [
      "Wireframes and interactive prototypes (Figma)",
      "Design systems with reusable components and tokens",
      "Responsive designs tested on real devices",
      "Accessibility review (contrast, focus states, semantic HTML)",
      "Design-to-code handoff for developer teams",
    ],
  },
];

export function ServicesPage() {
  useSeo({
    title: "Services — Web Development, DevOps & SEO in Malta",
    description:
      "Full-stack web development, Laravel and React apps, DevOps and Docker deployments, WordPress builds, technical SEO, and Google Ads management for businesses in Malta, the EU, and worldwide.",
    path: "/services",
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
                ▸ Services
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Web Development, DevOps &amp; Digital Marketing
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                End-to-end delivery for web projects — I design the interface, build the frontend and
                backend, deploy the infrastructure, and run the marketing. Below is what I offer,
                and what's included in each engagement.
              </p>
            </motion.div>

            {/* Services */}
            <motion.div variants={fadeUp} className="space-y-8">
              {SERVICE_DETAILS.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                      {service.title}
                    </h2>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                      {service.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{service.summary}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {service.details}
                  </p>
                  <div className="mt-6 border-t border-border pt-5">
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      What's included
                    </div>
                    <ul className="space-y-2">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* How I work */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-foreground">How I work</h2>
              <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">1. Discovery call.</span> A free
                  30-minute call to understand your goals, users, and constraints. No obligation.
                </li>
                <li>
                  <span className="font-semibold text-foreground">2. Proposal &amp; fixed quote.</span>{" "}
                  Within 48 hours you get a written proposal with scope, timeline, milestones, and a
                  fixed price.
                </li>
                <li>
                  <span className="font-semibold text-foreground">3. Kickoff &amp; regular updates.</span>{" "}
                  Weekly progress updates by email or WhatsApp, plus a staging URL you can review at
                  any time.
                </li>
                <li>
                  <span className="font-semibold text-foreground">4. Launch &amp; handover.</span>{" "}
                  Full source code, deployment documentation, and a 30-day post-launch support
                  window included with every project.
                </li>
              </ol>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center sm:p-8"
            >
              <h2 className="font-display text-xl font-semibold text-foreground">
                Ready to start?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell me what you're building — I'll reply within 24 hours.
              </p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow-sm transition-transform hover:scale-[1.03]"
              >
                Get in touch
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
