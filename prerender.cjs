/**
 * Post-build prerender step.
 *
 * The app is a client-rendered SPA — one static index.html is served for every
 * route, and React updates <title>, <meta>, and <link rel="canonical"> on mount.
 * That works for humans and for Googlebot with JS rendering, but non-JS
 * crawlers (and AdSense reviewers) see the homepage's canonical, title, and
 * fallback content on every URL — which reads as a site full of duplicate
 * pages.
 *
 * This script fixes that. After `vite build` writes dist/index.html, we:
 *   1. Clone that HTML per route (/about, /services, /contact, /blog, ...)
 *   2. Rewrite <title>, meta description, canonical, and OG tags per route
 *   3. Replace the SEO fallback content inside #root with route-specific text
 *   4. Write each to dist/<route>/index.html
 *
 * Apache's DirectorySlash + DirectoryIndex serves dist/about/index.html when
 * a request for /about arrives, because the existing .htaccess check
 * (RewriteCond %{REQUEST_FILENAME} -d) matches a directory before falling
 * through to the SPA fallback.
 *
 * React still hydrates on top of whatever HTML the server sent, so the user
 * experience doesn't change. Only the crawler view improves.
 */

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const SRC = path.join(DIST, 'index.html');
const SITE = 'https://fahadalnoman.com';
const AVATAR = `${SITE}/avatar_v2.jpg`;

/**
 * Per-route metadata + minimal SEO fallback body (crawler-only).
 * Order matches sitemap.xml priority. The homepage keeps its rich existing
 * fallback — we only overwrite non-home routes.
 */
const ROUTES = [
  {
    path: '/about',
    title: 'About Fahad Al Noman — Full-Stack Developer & DevOps Engineer in Malta',
    description:
      "Learn about Fahad Al Noman — a full-stack developer and DevOps engineer based in Qormi, Malta. Six years building marketplaces, deploying production infrastructure, and growing organic traffic for clients across Europe and Asia.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/services">Services</a> <a href="/contact">Contact</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>About Fahad Al Noman</h1>
        <p>Fahad Al Noman is a full-stack developer and DevOps engineer based in Qormi, Malta.
        Six years of experience building production web applications end-to-end — from React and
        Next.js frontends down to the Linux servers and PostgreSQL databases that keep them running.</p>
        <h2>Work Experience</h2>
        <ul>
          <li><strong>Marketing &amp; Technology Coordinator at Prochimps LTD</strong> — Jul 2026 to Present. Santa Venera, Malta.</li>
          <li><strong>Junior DevOps Engineer at CartUp LTD</strong> — Aug 2024 to Feb 2026. Deployed and managed e-commerce apps on Hostinger VPS. Docker containerisation. Python-based PostgreSQL backups.</li>
          <li><strong>Marketing &amp; Technology Coordinator at SAIL Corporation</strong> — Apr 2022 to Jul 2024. Built Bonikbazar.com marketplace, grew bdproperty.xyz to 5M+ visits.</li>
          <li><strong>Freelance Full-Stack Web Developer</strong> — 2020 to Present.</li>
        </ul>
        <h2>Skills</h2>
        <p>React, Next.js, Laravel, Python, PHP, Docker, Linux, PostgreSQL, MySQL, technical SEO, Google Ads, digital marketing.</p>
        <h2>Certifications</h2>
        <ul>
          <li>Programming with a Purpose — Princeton University</li>
          <li>SEO with Squarespace — Coursera</li>
          <li>Fundamentals of Machine Learning and AI — Amazon Web Services</li>
          <li>Google Ads for Beginners — Coursera</li>
        </ul>
        <p><a href="/contact">Get in touch</a></p>
      </main>
    `,
  },
  {
    path: '/services',
    title: 'Services — Web Development, DevOps & SEO in Malta',
    description:
      "Full-stack web development, Laravel and React apps, DevOps and Docker deployments, WordPress builds, technical SEO, and Google Ads management for businesses in Malta, the EU, and worldwide.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/contact">Contact</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>Web Development, DevOps &amp; Digital Marketing Services</h1>
        <p>End-to-end delivery for web projects — design the interface, build the frontend and backend, deploy the infrastructure, and run the marketing.</p>
        <h2>React &amp; Next.js Development</h2>
        <p>Custom React and Next.js apps with TypeScript, server-side rendering, API integrations, and Core Web Vitals tuning.</p>
        <h2>Laravel Web App Development</h2>
        <p>Secure Laravel backends with REST APIs, admin dashboards, PostgreSQL and MySQL schema design, and payment integrations.</p>
        <h2>DevOps, Docker &amp; VPS Management</h2>
        <p>Deploy and containerise applications on Hostinger, DigitalOcean, or any Linux VPS. SSH hardening, automated PostgreSQL backups, Nginx and HTTPS via Let's Encrypt.</p>
        <h2>WordPress Development &amp; Maintenance</h2>
        <p>Custom WordPress themes, WooCommerce stores, speed optimisation, and ongoing maintenance.</p>
        <h2>SEO for Malta &amp; EU Businesses</h2>
        <p>Technical audits, on-page optimisation, local citations, and Google Business Profile management for Malta and EU targeting.</p>
        <h2>Google Ads &amp; Digital Marketing</h2>
        <p>Google Ads campaigns, conversion tracking, Meta ads, and landing page conversion optimisation. Case study: 5M+ visits to bdproperty.xyz.</p>
        <h2>UI / UX Design</h2>
        <p>Clean, modern interface design with Figma prototypes, responsive layouts, and accessibility built in.</p>
        <p><a href="/contact">Get in touch to start</a></p>
      </main>
    `,
  },
  {
    path: '/contact',
    title: 'Contact Fahad Al Noman — Hire a Full-Stack Developer in Malta',
    description:
      "Get in touch with Fahad Al Noman for freelance web development, Laravel and React projects, DevOps and Docker deployments, SEO audits, and Google Ads campaigns. Based in Qormi, Malta — available worldwide.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>Contact Fahad Al Noman</h1>
        <p>Whether you're planning a new build, need someone to take over an existing project, or want an SEO audit — send a message. I read every enquiry personally and usually reply the same day.</p>
        <h2>Response time</h2>
        <p>Within 24 hours, Monday to Saturday.</p>
        <h2>Working with</h2>
        <p>Clients worldwide. Based in Malta. Have delivered projects across the EU, UK, US, Canada, Australia, and Bangladesh.</p>
        <h2>Availability</h2>
        <p>Freelance and contract engagements — from short one-off builds to long-term retainers.</p>
        <h2>Get in touch</h2>
        <address>
          <p>Email: <a href="mailto:fahadnomanofficial@gmail.com">fahadnomanofficial@gmail.com</a></p>
          <p>Phone: <a href="tel:+35699784477">+356 9978 4477</a></p>
          <p>WhatsApp: <a href="https://wa.me/35699784477">Chat on WhatsApp</a></p>
          <p>Location: Qormi, Malta</p>
          <p>LinkedIn: <a href="https://www.linkedin.com/in/fahad-al-noman-555039411/" rel="noreferrer">fahad-al-noman on LinkedIn</a></p>
        </address>
      </main>
    `,
  },
  {
    path: '/blog',
    title: 'Blog — Fahad Al Noman',
    description:
      "Notes from building on the web — lessons from shipping marketplaces, growing traffic, and working with developers around the world. Articles on Laravel, React, DevOps, PostgreSQL, technical SEO, and freelance business.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a></nav></header>
      <main>
        <h1>Blog</h1>
        <p>Notes from building on the web — lessons from shipping marketplaces, growing traffic, and working with developers around the world.</p>
        <p>Articles cover full-stack web development, Laravel and React, DevOps and Docker on Linux VPS, PostgreSQL, technical SEO, Google Ads, and freelance business tips.</p>
        <p>Browse posts at <a href="/blog">/blog</a>.</p>
      </main>
    `,
  },
  {
    path: '/faq',
    title: 'FAQ — Frequently Asked Questions — Fahad Al Noman',
    description:
      "Find answers to frequently asked questions about Fahad Al Noman's engineering blog, tutorial code usage permissions, freelance availability, and tech stack.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>Frequently Asked Questions</h1>
        <p>Answers to common questions about this engineering blog, tutorial code usage permissions, freelance availability, and tech stack.</p>
        <h2>Can I use the code from your tutorials?</h2>
        <p>Yes, all code snippets and configurations are released under permissive MIT terms for personal and commercial use.</p>
        <h2>Are the tutorials free?</h2>
        <p>Yes, 100% free with no paywalls.</p>
        <h2>Do you take on freelance projects?</h2>
        <p>Yes, open to freelance web development, Laravel and React builds, DevOps setup, and SEO consulting.</p>
        <p><a href="/faq">Read all 10 FAQs</a></p>
      </main>
    `,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Fahad Al Noman',
    description:
      "Privacy policy for Fahad Al Noman's portfolio site. GDPR-compliant. Details on cookies, Google Analytics, Google AdSense, third-party advertising vendors, and your rights under EU data protection law.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a></nav></header>
      <main>
        <h1>Privacy Policy</h1>
        <p>Privacy policy for fahadalnoman.com — including how we collect and use data, cookie consent, Google Analytics, Google AdSense advertising cookies (including the DoubleClick DART cookie), and your rights under the General Data Protection Regulation (GDPR).</p>
        <p>Read the full policy on the site.</p>
      </main>
    `,
  },
  {
    path: '/terms',
    title: 'Terms of Service — Fahad Al Noman',
    description:
      "Terms of service for Fahad Al Noman's portfolio and freelance web development services. Governing law, intellectual property, user conduct, and limitation of liability.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a></nav></header>
      <main>
        <h1>Terms of Service</h1>
        <p>Terms of service governing use of fahadalnoman.com and the professional freelance services offered — including web development, DevOps, SEO, and digital marketing.</p>
      </main>
    `,
  },
  {
    path: '/sitemap',
    title: 'Sitemap — Fahad Al Noman',
    description:
      "Complete sitemap of fahadalnoman.com — About, Services, Contact, Blog, Privacy Policy, Terms of Service, and every published blog post.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a></nav></header>
      <main>
        <h1>Sitemap</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
      </main>
    `,
  },
];

function replaceOrInsert(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

/**
 * Given the base index.html, produce a per-route variant.
 */
function makeRoutePage(baseHtml, route) {
  const url = `${SITE}${route.path}`;
  let html = baseHtml;

  // <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${route.title}</title>`
  );

  // <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );

  // <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`
  );

  // og:title, og:description, og:url
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${route.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`
  );

  // twitter:title, twitter:description
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${route.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );

  // Replace the SEO fallback content inside noscript
  // (Browsers ignore noscript when JS is enabled, but non-JS crawlers parse it.)
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>[\s\S]*?<noscript>[\s\S]*?<\/noscript>\s*<script type="module"/,
    `<div id="root"></div>
    <noscript>
      ${route.body.trim()}
    </noscript>
    <script type="module"`
  );

  return html;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`prerender: dist/index.html not found — run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(SRC, 'utf8');
  let written = 0;

  for (const route of ROUTES) {
    const routeDir = path.join(DIST, route.path.replace(/^\//, ''));
    fs.mkdirSync(routeDir, { recursive: true });

    const outPath = path.join(routeDir, 'index.html');
    const html = makeRoutePage(baseHtml, route);
    fs.writeFileSync(outPath, html, 'utf8');
    written++;
    console.log(`  prerendered ${route.path.padEnd(12)} → ${path.relative(DIST, outPath)}`);
  }

  console.log(`prerender: wrote ${written} per-route HTML files.`);
}

main();
