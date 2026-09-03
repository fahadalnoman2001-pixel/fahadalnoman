import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertCircle, Mail, Lock, CheckCircle2, ExternalLink } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { useSeo } from "@/hooks/use-seo";

export function PrivacyPage() {
  useSeo({
    title: "Privacy Policy — Fahad Al Noman",
    description:
      "Privacy Policy for fahadalnoman.com. GDPR-compliant (Malta/EU). Details on cookies, Google Analytics 4, Google AdSense, affiliate disclosures, and your data rights.",
    path: "/privacy",
    keywords: [
      "Privacy Policy Fahad Al Noman",
      "GDPR Privacy Policy Malta",
      "Google AdSense Privacy",
      "Cookie Policy",
      "Data Protection Rights",
    ],
    customSchema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://fahadalnoman.com/privacy#webpage",
          "url": "https://fahadalnoman.com/privacy",
          "name": "Privacy Policy — Fahad Al Noman",
          "description": "Comprehensive Privacy Policy for fahadalnoman.com detailing data processing, GDPR compliance, Google AdSense disclosures, and cookie usage.",
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
                Privacy Policy
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-accent font-medium">
                  <Shield className="h-3.5 w-3.5" />
                  GDPR Compliant (Malta / EU)
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
                <strong>Legal Notice:</strong> This privacy policy is a template tailored to the operations of fahadalnoman.com and should be reviewed by a qualified professional to ensure ongoing compliance with your specific regional obligations.
              </div>
            </motion.div>

            {/* Policy Content Sections */}
            <motion.div
              variants={fadeUp}
              className="space-y-10 text-sm leading-relaxed text-muted-foreground"
            >
              {/* 1. Introduction & Controller */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  1. Data Controller Information
                </h2>
                <p>
                  This website (<strong>fahadalnoman.com</strong>) is operated by <strong>Fahad Al Noman</strong> [or YOUR REGISTERED LEGAL ENTITY IF APPLICABLE], located in Qormi, Malta (European Union). As the Data Controller under the EU General Data Protection Regulation (Regulation (EU) 2016/679 - "GDPR") and Chapter 586 of the Laws of Malta (Data Protection Act), I am committed to handling your personal data responsibly, transparently, and securely.
                </p>
                <p>
                  If you have any questions regarding this policy or wish to exercise any of your statutory rights, you may contact me directly at:
                </p>
                <div className="rounded-xl border border-border bg-surface/60 p-4 font-mono text-xs text-foreground space-y-1">
                  <p><strong>Data Controller:</strong> Fahad Al Noman [YOUR LEGAL NAME / ENTITY]</p>
                  <p><strong>Contact Email:</strong> hello@fahadalnoman.com</p>
                  <p><strong>Location:</strong> Qormi, Malta (EU)</p>
                </div>
              </section>

              {/* 2. What Data is Collected */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  2. Personal Data We Collect
                </h2>
                <p>
                  Depending on how you interact with this website, we may collect and process the following categories of data:
                </p>
                <ul className="list-disc space-y-2 pl-5 font-sans">
                  <li>
                    <strong>Contact Form Inquiries:</strong> When you submit a project brief or general message via our Contact form (/contact), we collect your name, email address, and the text of your message.
                  </li>
                  <li>
                    <strong>Newsletter Subscriptions:</strong> If you voluntarily join our engineering newsletter, we collect and store your email address to send occasional technical articles and updates. You may unsubscribe at any time via the link in each email.
                  </li>
                  <li>
                    <strong>Blog Comments &amp; Reactions:</strong> When you leave a comment on a tutorial, we store your chosen display name and comment content. Article emoji reactions are aggregated anonymously.
                  </li>
                  <li>
                    <strong>Analytics &amp; Usage Data:</strong> With your explicit consent, we collect technical metrics via Google Analytics 4 (GA4), including anonymized IP addresses, browser types, device categories, operating systems, referring URLs, pages visited, and session duration.
                  </li>
                  <li>
                    <strong>Advertising Identifiers:</strong> With your consent, third-party advertising partners (such as Google AdSense) may collect pseudonymous identifiers and cookie data to deliver relevant advertisements.
                  </li>
                </ul>
              </section>

              {/* 3. Cookies & Consent */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  3. Cookies &amp; Consent Management
                </h2>
                <p>
                  A cookie is a small text file saved on your computer or mobile device when you visit a website. We categorize cookies as follows:
                </p>
                <div className="grid gap-3 pt-1 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-surface p-4 space-y-1.5">
                    <div className="font-mono text-xs uppercase font-semibold text-foreground">Essential</div>
                    <p className="text-xs text-muted-foreground">Required for basic site navigation, security, and remembering your cookie consent preferences. Cannot be disabled.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4 space-y-1.5">
                    <div className="font-mono text-xs uppercase font-semibold text-foreground">Analytics</div>
                    <p className="text-xs text-muted-foreground">Google Analytics 4 cookies that help us understand reader engagement and aggregate traffic trends. Consent-gated.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4 space-y-1.5">
                    <div className="font-mono text-xs uppercase font-semibold text-foreground">Advertising</div>
                    <p className="text-xs text-muted-foreground">Google AdSense cookies used to serve contextual and personalized ads based on browsing habits. Consent-gated.</p>
                  </div>
                </div>
                <p className="pt-1">
                  You can change or revoke your cookie choices at any time via the cookie banner or by clearing your browser's local cookies and storage for fahadalnoman.com.
                </p>
              </section>

              {/* 4. Advertising & Google AdSense */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  4. Advertising &amp; Google AdSense
                </h2>
                <p>
                  This website is monetized with <strong>Google AdSense</strong> (Publisher ID: <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-accent">ca-pub-2736247339916233</code>), an advertising service provided by Google LLC.
                </p>
                <ul className="list-disc space-y-2 pl-5 font-sans">
                  <li>
                    Third-party vendors, including Google, use cookies (such as the Google advertising / DoubleClick DART cookie) to serve ads based on a user's prior visits to this website or other websites across the Internet.
                  </li>
                  <li>
                    Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to fahadalnoman.com and other sites on the Web.
                  </li>
                  <li>
                    We do not pass personally identifiable information (such as your name or email) to Google AdSense.
                  </li>
                </ul>
                <div className="rounded-xl border border-border bg-surface/70 p-4 space-y-2">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
                    How to Opt Out of Personalized Advertising:
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    <li>
                      • You can opt out of personalized Google advertising by visiting{" "}
                      <a
                        href="https://www.google.com/settings/ads"
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent underline inline-flex items-center gap-1"
                      >
                        google.com/settings/ads
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </li>
                    <li>
                      • You can opt out of third-party vendor cookies for personalized ads by visiting{" "}
                      <a
                        href="https://www.aboutads.info/choices/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent underline inline-flex items-center gap-1"
                      >
                        aboutads.info/choices
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://www.youronlinechoices.eu/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent underline inline-flex items-center gap-1"
                      >
                        youronlinechoices.eu
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>{" "}
                      (EU).
                    </li>
                    <li>
                      • Learn how Google uses data when you use partner sites:{" "}
                      <a
                        href="https://policies.google.com/technologies/partner-sites"
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent underline inline-flex items-center gap-1"
                      >
                        policies.google.com/technologies/partner-sites
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 5. Analytics (GA4) */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  5. Analytics (Google Analytics 4)
                </h2>
                <p>
                  We utilize Google Analytics 4 (GA4) to understand which technical tutorials and pages readers find most useful. GA4 is configured with IP anonymization enabled.
                </p>
                <p>
                  GA4 tracking scripts only load after you grant analytics consent. If you decline consent, no analytics tracking cookies are placed on your device. You may also install the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>{" "}
                  to prevent your data from being used across any website.
                </p>
              </section>

              {/* 6. Affiliate Links Disclosure */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  6. Affiliate Links Disclosure
                </h2>
                <p>
                  Some articles and tutorial recommendations on fahadalnoman.com may contain affiliate links (e.g., links to cloud VPS hosting providers, developer tools, or domain registrars).
                </p>
                <p>
                  If you click an affiliate link and make a purchase, I may earn a small referral commission at <strong>no extra cost to you</strong>. I only recommend software, platforms, and infrastructure services that I personally test, utilize in production, and believe deliver genuine value to fellow engineers.
                </p>
              </section>

              {/* 7. Legal Bases & GDPR Rights */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  7. Legal Basis &amp; Your Rights Under GDPR
                </h2>
                <p>
                  Under European data protection law (GDPR), we process your data under the following legal bases:
                </p>
                <ul className="list-disc space-y-1.5 pl-5 font-sans">
                  <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> For analytics, marketing cookies, and optional newsletter subscriptions.</li>
                  <li><strong>Contractual Necessity (Art. 6(1)(b) GDPR):</strong> To respond to freelance inquiries or provide agreed development services.</li>
                  <li><strong>Legitimate Interests (Art. 6(1)(f) GDPR):</strong> To secure the website against spam, cyber threats, and maintain service reliability.</li>
                </ul>

                <h3 className="font-display text-base font-semibold text-foreground pt-2">
                  Your Statutory Rights:
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 pt-1 text-xs">
                  <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                    <span className="font-semibold text-foreground">Right to Access (Art. 15):</span>
                    <p className="text-muted-foreground">Request a copy of the personal data we hold about you.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                    <span className="font-semibold text-foreground">Right to Rectification (Art. 16):</span>
                    <p className="text-muted-foreground">Request correction of inaccurate or incomplete records.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                    <span className="font-semibold text-foreground">Right to Erasure (Art. 17):</span>
                    <p className="text-muted-foreground">Request complete deletion of your data ("right to be forgotten").</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                    <span className="font-semibold text-foreground">Right to Restriction (Art. 18):</span>
                    <p className="text-muted-foreground">Limit how we process or store your personal information.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                    <span className="font-semibold text-foreground">Right to Data Portability (Art. 20):</span>
                    <p className="text-muted-foreground">Receive your data in a structured, machine-readable format.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                    <span className="font-semibold text-foreground">Right to Object (Art. 21):</span>
                    <p className="text-muted-foreground">Object to processing based on legitimate interests at any time.</p>
                  </div>
                </div>

                <p className="pt-2">
                  To exercise any of these rights, email <strong className="text-foreground">hello@fahadalnoman.com</strong>. We will respond and process your request within 30 days free of charge.
                </p>
                <p>
                  If you believe your data has been handled improperly, you have the right to lodge a complaint with the supervisory authority in Malta:
                </p>
                <div className="rounded-xl border border-border bg-surface/50 p-3 font-mono text-xs text-muted-foreground">
                  <p><strong>Office of the Information and Data Protection Commissioner (IDPC)</strong></p>
                  <p>Floor 2, Airways House, High Street, Sliema SLM 1549, Malta</p>
                  <p>Website: <a href="https://idpc.org.mt" target="_blank" rel="noreferrer" className="text-accent underline">idpc.org.mt</a></p>
                </div>
              </section>

              {/* 8. Data Retention & Security */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  8. Data Retention &amp; Security Measures
                </h2>
                <p>
                  Contact inquiries and email communications are retained only as long as necessary to complete client discussions or fulfill legal and accounting obligations. Newsletter records are retained until you choose to unsubscribe.
                </p>
                <p>
                  We employ rigorous technical safeguards, including HTTPS/TLS encryption across all routes, hardened Linux servers, secure firewall policies, SSH key authentication, and isolated database access controls to protect personal data from unauthorized access or disclosure.
                </p>
              </section>

              {/* 9. Third-Party Links & Children */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  9. External Links &amp; Children's Privacy
                </h2>
                <p>
                  Our blog posts and portfolio include links to third-party tools, documentation, GitHub repositories, and client platforms. We are not responsible for the privacy practices or contents of these external domains.
                </p>
                <p>
                  This website is intended for professional developers, technology leaders, and adult audiences. We do not knowingly collect personal data from individuals under 16 years of age.
                </p>
              </section>

              {/* 10. Contact & Changes */}
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  10. Policy Amendments &amp; Privacy Contact
                </h2>
                <p>
                  We may periodically update this Privacy Policy to reflect changing legal requirements or operational practices. Any revisions will be published on this page with an updated "Last updated" date.
                </p>
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-center space-y-2 mt-4">
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Have Privacy Questions or Data Inquiries?
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Reach out directly for data access requests, deletion, or privacy clarifications.
                  </p>
                  <div className="pt-2">
                    <a
                      href="mailto:hello@fahadalnoman.com"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-foreground shadow-glow-sm transition-transform hover:scale-[1.02]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      hello@fahadalnoman.com
                    </a>
                  </div>
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
