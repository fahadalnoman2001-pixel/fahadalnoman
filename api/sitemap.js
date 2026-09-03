import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

function loadStaticSitemap() {
  const candidates = [
    join(process.cwd(), 'public', 'sitemap.xml'),
    join(process.cwd(), 'sitemap.xml'),
    join('/var/task', 'public', 'sitemap.xml'),
    join('/var/task', 'sitemap.xml'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p, 'utf8');
  }
  return null;
}

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  const xml = loadStaticSitemap();
  if (xml) return res.status(200).send(xml);
  return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
}
