/**
 * Build-time static sitemap generator.
 *
 * Why this exists:
 *   The previous public/sitemap.php relied on Apache mod_rewrite and PHP,
 *   but the site is hosted on Vercel — which serves only static files
 *   from public/. PHP is not executed, so the rewrite never fired and
 *   fahadalnoman.com/sitemap.xml returned 404.
 *
 *   This script runs as part of `npm run build` (prebuild), pulls the
 *   published blog posts and categories from the admin API once, and
 *   writes public/sitemap.xml as a real static file. Vercel then serves
 *   it directly at /sitemap.xml.
 *
 *   It also writes public/robots.txt (if not already present) so the
 *   Sitemap directive points at a URL that actually exists.
 *
 * Env vars (optional):
 *   SITE_URL              — full site origin (default https://fahadalnoman.com)
 *   SITEMAP_API_BASE      — admin API origin (default https://admin.zurvix.com/api)
 *   SITEMAP_API_TIMEOUT_MS — per-request timeout (default 8000)
 */

const fs = require('fs');
const path = require('path');

const SITE = (process.env.SITE_URL || 'https://fahadalnoman.com').replace(/\/+$/, '');
const API_BASE = (process.env.SITEMAP_API_BASE || 'https://admin.zurvix.com/api').replace(/\/+$/, '');
const TIMEOUT_MS = Number(process.env.SITEMAP_API_TIMEOUT_MS || 8000);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SITEMAP_OUT = path.join(PUBLIC_DIR, 'sitemap.xml');

// Keep this in sync with src/App.tsx routes and the prerender.cjs list.
const STATIC_ROUTES = [
  { loc: '/',         changefreq: 'monthly', priority: '1.0' },
  { loc: '/about',    changefreq: 'monthly', priority: '0.9' },
  { loc: '/services', changefreq: 'monthly', priority: '0.9' },
  { loc: '/contact',  changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog',     changefreq: 'daily',   priority: '0.9' },
  { loc: '/faq',      changefreq: 'monthly', priority: '0.6' },
  // No entry for /sitemap here — /sitemap.xml is the sitemap; the React app
  // redirects /sitemap (the page) to /sitemap.xml. Listing it would create a
  // self-referential entry and isn't useful for crawlers.
  { loc: '/terms',    changefreq: 'yearly',  priority: '0.3' },
  { loc: '/privacy',  changefreq: 'yearly',  priority: '0.3' },
];

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isoDate(value) {
  if (!value) return '';
  // Accept "2026-08-30T17:40:00.000000Z" or "2026-08-30" — return YYYY-MM-DD.
  const m = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'fahadalnoman-sitemap-generator/1.0',
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function renderUrl(loc, lastmod, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildSitemapXml({ staticRoutes, posts, categories }) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const r of staticRoutes) {
    lines.push(renderUrl(`${SITE}${r.loc}`, '', r.changefreq, r.priority));
  }

  for (const post of posts) {
    if (post.status !== 'published') continue;
    const slug = post.slug;
    if (!slug) continue;

    const lastmod = isoDate(post.updated_at) || isoDate(post.published_at) || isoDate(post.created_at) || isoDate(post.date);
    lines.push(renderUrl(`${SITE}/blog/${slug}`, lastmod, 'weekly', '0.8'));
  }

  for (const cat of categories) {
    const slug = cat.slug;
    if (!slug) continue;
    lines.push(renderUrl(`${SITE}/blog?category=${encodeURIComponent(slug)}`, '', 'weekly', '0.6'));
  }

  lines.push('</urlset>', '');
  return lines.join('\n');
}

function ensureRobotsTxt() {
  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  const desired = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /admin',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /dashboard',
    'Disallow: /api/',
    'Disallow: /api',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n');

  // Only overwrite if missing or doesn't already reference the right sitemap.
  let current = '';
  try {
    current = fs.readFileSync(robotsPath, 'utf8');
  } catch (_) {
    // not present
  }

  if (current.includes(`Sitemap: ${SITE}/sitemap.xml`)) {
    return false; // already correct
  }

  fs.writeFileSync(robotsPath, desired, 'utf8');
  return true;
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  let posts = [];
  let categories = [];

  // Pull dynamic content. Failures degrade gracefully — static routes still ship.
  try {
    const rawPosts = await fetchJson(`${API_BASE}/posts`);
    if (Array.isArray(rawPosts)) {
      posts = rawPosts.filter((p) => p && p.status === 'published');
    }
  } catch (err) {
    console.warn(`[sitemap] posts fetch failed: ${err.message} — continuing with static routes only`);
  }

  try {
    const rawCategories = await fetchJson(`${API_BASE}/categories`);
    if (Array.isArray(rawCategories)) {
      categories = rawCategories.filter((c) => c && c.slug);
    }
  } catch (err) {
    console.warn(`[sitemap] categories fetch failed: ${err.message} — continuing without category URLs`);
  }

  const xml = buildSitemapXml({ staticRoutes: STATIC_ROUTES, posts, categories });
  fs.writeFileSync(SITEMAP_OUT, xml, 'utf8');

  const robotsChanged = ensureRobotsTxt();

  const urlCount = STATIC_ROUTES.length + posts.length + categories.length;
  console.log(`[sitemap] wrote ${SITEMAP_OUT} (${urlCount} URLs: ${STATIC_ROUTES.length} static, ${posts.length} posts, ${categories.length} categories)`);
  if (robotsChanged) {
    console.log(`[sitemap] wrote ${path.join(PUBLIC_DIR, 'robots.txt')}`);
  } else {
    console.log(`[sitemap] robots.txt already up to date`);
  }
}

main().catch((err) => {
  console.error(`[sitemap] fatal: ${err.stack || err.message}`);
  // Non-zero exit would block the build. Write a minimal fallback sitemap so
  // the build still ships a usable file (static routes only) and exit 0.
  try {
    const xml = buildSitemapXml({ staticRoutes: STATIC_ROUTES, posts: [], categories: [] });
    fs.writeFileSync(SITEMAP_OUT, xml, 'utf8');
    ensureRobotsTxt();
    console.error(`[sitemap] wrote fallback sitemap (static routes only)`);
  } catch (e2) {
    console.error(`[sitemap] could not write fallback: ${e2.message}`);
    process.exit(1);
  }
});
