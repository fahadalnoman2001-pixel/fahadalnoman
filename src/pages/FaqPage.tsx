import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, HelpCircle, Mail, MessageSquare } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { useSeo } from "@/hooks/use-seo";

const FAQ_ITEMS = [
  {
    id: "who-is-fahad",
    question: "Who is Fahad Al Noman?",
    answer:
      "Fahad Al Noman is a full-stack developer and DevOps engineer based in Qormi, Malta (EU). With over six years of hands-on experience, he specializes in building production web applications using Laravel, React, Next.js, and Docker, and maintaining high-availability Linux cloud infrastructure.",
  },
  {
    id: "blog-coverage",
    question: "What does this blog cover?",
    answer:
      "This blog publishes practical, production-grade engineering guides and technical notes. Topics include Laravel 11 backend architecture, React 19 & Next.js frontend engineering, Docker VPS deployment, Linux server hardening, PostgreSQL database tuning, and technical SEO / GEO optimization.",
  },
  {
    id: "use-tutorial-code",
    question: "Can I use the code from your tutorials in my commercial or personal projects?",
    answer:
      "Yes, absolutely. All code snippets, scripts, configurations, and boilerplates published in tutorials on fahadalnoman.com are released under permissive terms (such as the MIT License) unless otherwise noted. You are free to adapt, integrate, and deploy them in personal or commercial projects.",
  },
  {
    id: "free-tutorials",
    question: "Are all tutorials and articles completely free?",
    answer:
      "Yes. Every article, guide, and tutorial on this site is 100% free to read with no paywalls or required sign-ups. The site is supported through non-intrusive Google AdSense advertising and occasional affiliate partnerships.",
  },
  {
    id: "freelance-services",
    question: "Do you accept freelance or contract development work?",
    answer:
      "Yes. I take on select freelance projects, bespoke web application builds, DevOps infrastructure setup, and technical SEO advisory for clients in Malta, the EU, and worldwide. Feel free to send your project requirements via the Contact page or email hello@fahadalnoman.com.",
  },
  {
    id: "how-to-contact",
    question: "How can I contact you?",
    answer:
      "You can get in touch directly via the website's Contact page (/contact) or by emailing hello@fahadalnoman.com. I review every inquiry personally and typically respond within 24 hours Monday through Saturday.",
  },
  {
    id: "guest-posts",
    question: "Do you accept guest posts or sponsored articles?",
    answer:
      "All editorial articles on this blog are personally researched, written, and verified by Fahad Al Noman based on real production experience. High-quality technical collaborations and relevant sponsorship opportunities are reviewed on a case-by-case basis.",
  },
  {
    id: "publishing-frequency",
    question: "How often do you publish new articles?",
    answer:
      "In-depth technical guides and case studies are published on a regular monthly basis. You can subscribe to the newsletter at the bottom of the page to receive email alerts whenever a new engineering breakdown goes live.",
  },
  {
    id: "tech-stack",
    question: "What is your primary technology stack?",
    answer:
      "My primary development and deployment stack comprises TypeScript, React 19, Next.js, and Tailwind CSS on the frontend; PHP 8.4 and Laravel 11 or Node.js on the backend; PostgreSQL and MySQL for relational data; and Docker, Nginx, and Linux (Ubuntu/Debian) for VPS cloud hosting.",
  },
  {
    id: "location-timezone",
    question: "Where are you located and what time zone do you work in?",
    answer:
      "I am based in Qormi, Malta, operating within Central European Time (CET / CEST / UTC+1). I collaborate smoothly with remote teams and clients across Europe, North America, the UK, and Asia.",
  },
];

export function FaqPage() {
  const [openIds, setOpenIds] = useState<string[]>(["who-is-fahad", "use-tutorial-code"]);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useSeo({
    title: "FAQ — Frequently Asked Questions — Fahad Al Noman",
    description:
      "Find answers to frequently asked questions about Fahad Al Noman's engineering blog, tutorial code usage permissions, freelance availability, and tech stack.",
    path: "/faq",
    keywords: [
      "Fahad Al Noman FAQ",
      "Developer FAQ",
      "Laravel Tutorial Code License",
      "Freelance Web Developer Malta",
      "DevOps Consulting Questions",
    ],
    customSchema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://fahadalnoman.com/faq#webpage",
          "url": "https://fahadalnoman.com/faq",
          "name": "Frequently Asked Questions — Fahad Al Noman",
          "description": "Answers to common questions regarding Fahad Al Noman's developer blog, tutorial code licensing, and freelance services.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://fahadalnoman.com/#website",
            "name": "Fahad Al Noman",
            "url": "https://fahadalnoman.com"
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://fahadalnoman.com/faq#faq",
          "mainEntity": FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
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
                ▸ Help &amp; Information
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Common questions about this blog, tutorial code usage permissions, freelance availability, and technical consulting.
              </p>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                Last updated: August 31, 2026
              </p>
            </motion.div>

            {/* Accordion FAQ List */}
            <motion.div variants={fadeUp} className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 ${
                      isOpen
                        ? "border-accent/40 bg-surface/90 shadow-sm"
                        : "border-border bg-surface/50 hover:border-border/80"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-3 font-display text-base sm:text-lg font-semibold text-foreground">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-xs font-bold text-accent">
                          {index + 1}
                        </span>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-accent" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/60 px-5 pt-3 pb-6 sm:px-6 sm:pb-6 text-sm leading-relaxed text-muted-foreground">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>

            {/* Still have questions CTA */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center space-y-3"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Still have a question?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                If your question isn't answered above or you'd like to discuss a custom web development or DevOps project, feel free to reach out.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs sm:text-sm font-semibold text-accent-foreground shadow-glow-sm transition-transform hover:scale-[1.03]"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Contact Fahad
                </Link>
                <a
                  href="mailto:hello@fahadalnoman.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
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
