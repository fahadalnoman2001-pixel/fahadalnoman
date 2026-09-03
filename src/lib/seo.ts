/**
 * Central place for updating <head> metadata on route changes.
 *
 * Updates dynamic <title>, meta description, keywords, tags,
 * canonical, OpenGraph, Twitter Cards, and Schema.org JSON-LD (GEO / AI-SEO).
 */

export const SITE_URL = "https://fahadalnoman.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/avatar_v2.jpg`;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoOptions {
  /** Page <title> and og:title / twitter:title */
  title: string;
  /** meta description and og:description / twitter:description */
  description: string;
  /** Path only, e.g. "/", "/blog", "/blog/my-post-slug", or absolute URL */
  path: string;
  /** og:type — defaults to "website" (blog posts should pass "article") */
  ogType?: string;
  /** Absolute image URL for og:image / twitter:image / schema */
  ogImage?: string | null;
  /** SEO Keywords & Tags */
  keywords?: string[] | string;
  tags?: string[];
  category?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string;
  authorUrl?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
  /** Custom Schema.org JSON-LD object or @graph payload */
  customSchema?: any;
  /** Set true for pages that shouldn't be indexed (leave false/omitted otherwise) */
  noindex?: boolean;
}

function setMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function toIso8601(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

function toAbsoluteUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const clean = url.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  return `${SITE_URL}${clean.startsWith("/") ? "" : "/"}${clean}`;
}

export function applySeo({
  title,
  description,
  path,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  keywords,
  tags,
  category,
  publishedTime,
  modifiedTime,
  author = "Fahad Al Noman",
  authorUrl = `${SITE_URL}/about`,
  breadcrumbs,
  faqs,
  customSchema,
  noindex = false,
}: SeoOptions) {
  const cleanPath = path.startsWith("http") ? path.replace(SITE_URL, "") : path;
  const url = `${SITE_URL}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
  const validImage = toAbsoluteUrl(ogImage);

  const publishedIso = toIso8601(publishedTime) || new Date().toISOString();
  const modifiedIso = toIso8601(modifiedTime) || publishedIso;

  document.title = title;

  // Description
  setMetaByName("description", description);

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);

  // Keywords
  const keywordsList: string[] = [];
  if (Array.isArray(keywords)) {
    keywordsList.push(...keywords);
  } else if (typeof keywords === "string" && keywords.trim()) {
    keywordsList.push(...keywords.split(",").map((k) => k.trim()));
  }
  if (tags && Array.isArray(tags)) {
    keywordsList.push(...tags);
  }
  if (category) {
    keywordsList.push(category);
  }

  if (keywordsList.length > 0) {
    const uniqueKeywords = Array.from(new Set(keywordsList.filter(Boolean))).join(", ");
    setMetaByName("keywords", uniqueKeywords);
  }

  // Author
  setMetaByName("author", author);

  // Open Graph
  setMetaByProperty("og:type", ogType);
  setMetaByProperty("og:title", title);
  setMetaByProperty("og:description", description);
  setMetaByProperty("og:url", url);
  if (validImage) {
    setMetaByProperty("og:image", validImage);
  }
  setMetaByProperty("og:site_name", "Fahad Al Noman");

  // Article specific OG tags
  if (ogType === "article") {
    setMetaByProperty("article:published_time", publishedIso);
    setMetaByProperty("article:modified_time", modifiedIso);
    setMetaByProperty("article:author", authorUrl);
    if (category) {
      setMetaByProperty("article:section", category);
    }
    // Clear old article:tag metas and insert fresh ones
    document.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
    if (tags && tags.length > 0) {
      tags.forEach((t) => {
        const tagEl = document.createElement("meta");
        tagEl.setAttribute("property", "article:tag");
        tagEl.setAttribute("content", t);
        document.head.appendChild(tagEl);
      });
    }
  }

  // Twitter Card
  setMetaByName("twitter:card", "summary_large_image");
  setMetaByName("twitter:site", "@fahadalnoman");
  setMetaByName("twitter:creator", "@fahadalnoman");
  setMetaByName("twitter:title", title);
  setMetaByName("twitter:description", description);
  if (validImage) {
    setMetaByName("twitter:image", validImage);
  }

  // Schema.org Structured Data (JSON-LD)
  let scriptLd = document.querySelector('script[type="application/ld+json"]#seo-jsonld') as HTMLScriptElement | null;
  if (!scriptLd) {
    scriptLd = document.createElement("script");
    scriptLd.setAttribute("type", "application/ld+json");
    scriptLd.setAttribute("id", "seo-jsonld");
    document.head.appendChild(scriptLd);
  }

  if (customSchema) {
    scriptLd.textContent = JSON.stringify(customSchema);
  } else if (ogType === "article") {
    const graph: any[] = [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          "name": "Fahad Al Noman",
          "url": SITE_URL,
        },
        "headline": title,
        "description": description,
        ...(validImage ? { "image": [validImage] } : {}),
        "datePublished": publishedIso,
        "dateModified": modifiedIso,
        "author": {
          "@type": "Person",
          "name": author,
          "url": authorUrl,
        },
        "publisher": {
          "@type": "Organization",
          "name": "Fahad Al Noman",
          "url": SITE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/avatar_v2.jpg`,
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url,
        },
        ...(keywordsList.length > 0 ? { "keywords": keywordsList.join(", ") } : {}),
        ...(category ? { "articleSection": category } : {}),
      },
    ];

    // Breadcrumbs schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push({
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "item": toAbsoluteUrl(b.url) || b.url,
        })),
      });
    }

    // FAQPage schema — ONLY when valid FAQ items exist
    if (faqs && faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer,
          },
        })),
      });
    }

    scriptLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  } else {
    scriptLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          "name": "Fahad Al Noman — Full-Stack Developer & Solutions Architect",
          "url": SITE_URL,
          "description": description,
          "publisher": {
            "@type": "Person",
            "name": "Fahad Al Noman",
            "url": `${SITE_URL}/about`,
          },
        },
      ],
    });
  }

  // Robots
  if (noindex) {
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
  } else {
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "index, follow");
  }
}
