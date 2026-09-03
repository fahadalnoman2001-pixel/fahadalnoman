import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, AlertCircle, Mail, FileText, Code2, AlertTriangle } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { useSeo } from "@/hooks/use-seo";

export function TermsPage() {
  useSeo({
    title: "Terms of Service — Fahad Al Noman",
    description:
      "Terms of Service for fahadalnoman.com. Code usage permissions, tutorial 'as-is' disclaimers, intellectual property, affiliate disclosures, and governing law (Malta/EU).",
    path: "/terms",
    keywords: [
      "Terms of Service Fahad Al Noman",
      "Developer Blog Terms",
      "Code License Disclaimer",
      "Website Terms Malta",
    ],
    customSchema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://fahadalnoman.com/terms#webpage",
          "url": "https://fahadalnoman.com/terms",
          "name": "Terms of Service — Fahad Al Noman",
          "description": "Terms of Service governing the use of fahadalnoman.com, code snippets, engineering tutorials, and freelance services.",
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
                ▸ Legal &amp; Policies
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Terms of Service
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-accent font-medium">
                  <Scale className="h-3.5 w-3.5" />
                  Governed by Laws of Malta (EU)
                </span>
                <span className="text-border">·</span>
                <span className="font-mono">Last updated: August 31, 2026</span>
              </div>
            </motion.div>

            {/* Legal Advisory Note */}
            <motion.div
              variants={fadeUp}
              className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-200/90"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong>Legal Notice:</strong> This is a template agreement governing your access to and use of fahadalnoman.com and should be reviewed by a qualified professional to ensure compliance with your jurisdiction.
              </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div
              variants={fadeUp}
              className="space-y-10 text-sm leading-relaxed text-muted-foreground"
            >
              {/* 1. Acceptance of Terms */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing, browsing, or utilizing the website <strong>fahadalnoman.com</strong> ("the Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you must discontinue using the Website immediately.
                </p>
                <p>
                  These terms apply to all visitors, users, and readers who access the portfolio, read blog tutorials, or interact with site features.
                </p>
              </section>

              {/* 2. Intellectual Property */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  2. Intellectual Property Rights
                </h2>
                <p>
                  Unless otherwise indicated, all original content published on this Website — including articles, blog posts, documentation, visual brand assets, logos, design layouts, and custom graphics — is the exclusive intellectual property of <strong>Fahad Al Noman</strong> [or YOUR REGISTERED LEGAL ENTITY] and is protected by copyright and intellectual property laws of Malta and the European Union.
                </p>
                <p>
                  You may not republish, reproduce, duplicate, or redistribute full articles or proprietary website assets without prior explicit written permission.
                </p>
              </section>

              {/* 3. Permitted Use of Code & Tutorials */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  3. Permitted Use of Code &amp; Technical Snippets
                </h2>
                <p>
                  We actively encourage learning and knowledge sharing. You are granted permission to use code snippets, configuration files (e.g., Dockerfiles, Nginx configs), scripts, and architecture patterns published in blog tutorials under the following conditions:
                </p>
                <ul className="list-disc space-y-1.5 pl-5 font-sans">
                  <li>
                    <strong>Commercial &amp; Personal Use:</strong> You may freely incorporate, adapt, and build upon tutorial code snippets in your personal, open-source, or commercial production projects.
                  </li>
                  <li>
                    <strong>Attribution (Appreciated):</strong> While not strictly required for small inline snippets, citing or linking back to the original tutorial on fahadalnoman.com is appreciated.
                  </li>
                  <li>
                    <strong>No Text Scraping:</strong> You may not scrape or republish the accompanying explanatory prose, tutorial text, or images onto content-farming websites or automated aggregators.
                  </li>
                </ul>
              </section>

              {/* 4. DISCLAIMER OF WARRANTIES ("AS IS") */}
              <section className="space-y-3 rounded-2xl border border-border bg-surface/70 p-5">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Important Technical Disclaimer</span>
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  4. Disclaimer of Warranties ("AS IS")
                </h2>
                <p className="text-foreground/90 font-medium">
                  ALL CONTENT, TUTORIALS, CODE SNIPPETS, SCRIPTS, DOCKER CONFIGURATIONS, SERVER COMMANDS, AND TECHNICAL OPINIONS ON FAHADALNOMAN.COM ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p>
                  While I make every effort to test and verify configurations in production environments, I make no representations or guarantees regarding the accuracy, completeness, security, or error-free operation of any instructions or code provided.
                </p>
                <p className="text-amber-200/90 text-xs">
                  <strong>Reader Responsibility:</strong> You assume full responsibility for testing code in isolated staging environments, creating database backups, and verifying firewall and security settings before executing commands on live production infrastructure.
                </p>
              </section>

              {/* 5. Limitation of Liability */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  5. Limitation of Liability
                </h2>
                <p>
                  To the maximum extent permitted by applicable law, in no event shall <strong>Fahad Al Noman</strong>, his affiliates, or contributors be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to:
                </p>
                <ul className="list-disc space-y-1 pl-5 font-sans">
                  <li>Your use or inability to use the Website, tutorials, or tools.</li>
                  <li>Server downtime, crashes, configuration errors, data corruption, or data loss.</li>
                  <li>Security breaches or unauthorized access resulting from third-party software or tools.</li>
                  <li>Any financial or business losses resulting from reliance on blog contents or recommendations.</li>
                </ul>
              </section>

              {/* 6. External Links & Affiliate Disclosure */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  6. External Links &amp; Affiliate Disclosure
                </h2>
                <p>
                  This Website may contain links to external third-party websites (e.g., GitHub, documentation sites, software vendors) as well as affiliate links for web hosting, cloud services, and developer tooling.
                </p>
                <p>
                  Fahad Al Noman has no control over the content, uptime, or privacy policies of third-party websites and assumes no liability for their practices. When you purchase a service through an affiliate link, we may receive a commission at no extra cost to you.
                </p>
              </section>

              {/* 7. User Conduct & Comment Policy */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  7. User Conduct &amp; Blog Moderation
                </h2>
                <p>
                  When interacting with blog posts, submitting comments, or sending inquiries via the Contact form, you agree not to:
                </p>
                <ul className="list-disc space-y-1 pl-5 font-sans">
                  <li>Submit abusive, defamatory, harassing, vulgar, or unlawful content.</li>
                  <li>Post spam, promotional advertising, referral links, or automated submissions.</li>
                  <li>Attempt to probe, scan, breach, or compromise website security or server infrastructure.</li>
                </ul>
                <p>
                  We reserve the right to review, edit, or delete any comment at our sole discretion without notice.
                </p>
              </section>

              {/* 8. Governing Law & Jurisdiction */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  8. Governing Law &amp; Jurisdiction
                </h2>
                <p>
                  These Terms of Service and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of <strong>Malta</strong> and applicable <strong>European Union</strong> legislation, without giving effect to any conflict of law principles.
                </p>
                <p>
                  You agree that any legal proceeding or dispute arising under these terms shall be submitted to the exclusive jurisdiction of the competent courts of Malta.
                </p>
              </section>

              {/* 9. Modifications to Terms */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  9. Modifications to Terms
                </h2>
                <p>
                  We reserve the right to revise or update these Terms of Service at any time. Material changes will be indicated by the "Last updated" date at the top of this page. Your continued use of the Website following any updates constitutes acceptance of the modified terms.
                </p>
              </section>

              {/* 10. Contact Information */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  10. Contact Information
                </h2>
                <p>
                  For any legal questions, permissions inquiries, or clarifications regarding these Terms of Service, please contact:
                </p>
                <div className="rounded-xl border border-border bg-surface/60 p-4 font-mono text-xs text-foreground space-y-1">
                  <p><strong>Name:</strong> Fahad Al Noman [YOUR LEGAL NAME / ENTITY]</p>
                  <p><strong>Email:</strong> hello@fahadalnoman.com</p>
                  <p><strong>Location:</strong> Qormi, Malta (EU)</p>
                </div>
              </section>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
