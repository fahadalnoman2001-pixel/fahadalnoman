// Vercel serverless function: /api/sitemap.xml
// Returns a sitemap dynamically. Used because Vite's public/ build pipeline
// does not reliably ship .xml static files in this Vercel deployment, and
// a function is always available regardless of build output quirks.

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Build-time generated sitemap lives at /var/task/public/sitemap.xml on Vercel.
// We try a few common locations so the function works whether the static file
// got copied or not.
function loadStaticSitemap() {
  const candidates = [
    join(process.cwd(), 'public', 'sitemap.xml'),
    join(process.cwd(), 'sitemap.xml'),
    join('/var/task', 'public', 'sitemap.xml'),
    join('/var/task', 'sitemap.xml'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      return readFileSync(p, 'utf8');
    }
  }
  return null;
}

export default function handler(req, res) {
  // Cache at the edge for 1 hour; allow stale-while-revalidate.
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');

  const xml = loadStaticSitemap();
  if (xml) {
    return res.status(200).send(xml);
  }

  // Hard fallback: an empty but valid sitemap. This should never trigger in
  // production because the build step always writes public/sitemap.xml.
  const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`;
  return res.status(200).send(fallback);
}
