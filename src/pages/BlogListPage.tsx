import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Search, Clock, FolderTree, Tag } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { fetchPosts, fetchCategories, type BlogPost, type BlogCategory } from "@/api/client";
import { applySeo, SITE_URL } from "@/lib/seo";

export function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const tagParam = searchParams.get("tag");

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setActiveTag(tagParam);
  }, [tagParam]);

  // Load posts and real categories
  useEffect(() => {
    Promise.all([
      fetchPosts(),
      fetchCategories().catch(() => []),
    ])
      .then(([postsData, catsData]) => {
        setPosts(postsData);
        setCategories(catsData);
      })
      .catch((err) => console.error("Failed to load posts/categories:", err))
      .finally(() => setLoading(false));
  }, []);

  // Update dynamic SEO based on active category / tag / general blog
  useEffect(() => {
    if (activeCategory) {
      const cat = categories.find((c) => c.slug === activeCategory);
      const catTitle = cat?.seo_title || cat?.name ? `${cat?.name} Articles & Notes — Fahad Al Noman` : "Journal — Fahad Al Noman";
      const catDesc = cat?.seo_meta?.meta_description || cat?.description || `Read in-depth technical guides and architectures on ${cat?.name || activeCategory} by Fahad Al Noman.`;
      applySeo({
        title: catTitle,
        description: catDesc,
        path: `/blog?category=${activeCategory}`,
        keywords: cat?.seo_meta?.keywords || cat?.tags || [activeCategory],
        tags: cat?.tags || [activeCategory],
        category: cat?.name || activeCategory,
      });
    } else if (activeTag) {
      applySeo({
        title: `Articles Tagged "${activeTag}" — Fahad Al Noman`,
        description: `Explore engineering notes, architecture patterns, and technical write-ups tagged with #${activeTag} by Fahad Al Noman.`,
        path: `/blog?tag=${encodeURIComponent(activeTag)}`,
        keywords: [activeTag, "full-stack", "DevOps", "Laravel", "React"],
        tags: [activeTag],
      });
    } else {
      applySeo({
        title: "Journal — Fahad Al Noman",
        description:
          "Notes on shipping web apps, running Linux servers, growing organic traffic, and building for clients in Malta and beyond. By Fahad Al Noman — full-stack developer and DevOps engineer.",
        path: "/blog",
        keywords: ["full-stack developer", "Laravel", "DevOps", "PostgreSQL", "React", "Malta engineer"],
      });
    }
  }, [activeCategory, activeTag, categories]);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    let list = posts;
    if (activeCategory) {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) {
        list = list.filter((p) => (p as any).category_id === cat.id || p.tags.includes(cat.name) || p.tags.includes(cat.slug));
      }
    }
    if (activeTag) {
      list = list.filter((p) => p.tags.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, activeCategory, activeTag, searchQuery, categories]);

  const handleCategoryClick = (slug: string | null) => {
    setActiveCategory(slug);
    setActiveTag(null);
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set("category", slug);
      newParams.delete("tag");
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    const newParams = new URLSearchParams(searchParams);
    if (tag) {
      newParams.set("tag", tag);
    } else {
      newParams.delete("tag");
    }
    setSearchParams(newParams);
  };

  const featured = useMemo(
    () => posts.find((p) => p.featured) ?? posts[0],
    [posts]
  );
  const rest = useMemo(
    () =>
      filteredPosts.filter(
        (p) => !(featured && !searchQuery && !activeTag && !activeCategory && p.slug === featured.slug)
      ),
    [filteredPosts, featured, searchQuery, activeTag, activeCategory]
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Nav />

      <main className="pt-28 pb-32">
        {/* ── Masthead ─────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 pb-14 sm:px-8">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Journal & Insights
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
                Notes from building on&nbsp;the&nbsp;web.
              </h1>
              <p className="max-w-md font-serif text-[17px] leading-relaxed text-muted-foreground md:text-right">
                Practical writing on full-stack development, DevOps, PostgreSQL,
                technical SEO, and running a freelance practice from Malta.
              </p>
            </div>
          </div>
        </section>

        {/* ── Filter row: Real Categories & Tags ───────────────── */}
        <div className="sticky top-[64px] z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 overflow-x-auto">
              <button
                onClick={() => {
                  handleCategoryClick(null);
                  handleTagClick(null);
                }}
                className={`whitespace-nowrap text-sm transition-colors cursor-pointer ${
                  !activeCategory && !activeTag
                    ? "font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All posts
              </button>

              {/* Real Categories from Admin Panel */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(activeCategory === cat.slug ? null : cat.slug)}
                  className={`whitespace-nowrap text-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.slug
                      ? "font-bold text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FolderTree className="size-3.5 opacity-70" />
                  {cat.name}
                  {cat.blog_posts_count !== undefined && cat.blog_posts_count > 0 && (
                    <span className="text-[10px] opacity-60">({cat.blog_posts_count})</span>
                  )}
                </button>
              ))}

              {/* Tags */}
              {allTags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(activeTag === tag ? null : tag)}
                  className={`whitespace-nowrap text-sm transition-colors cursor-pointer ${
                    activeTag === tag
                      ? "font-bold text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-12 sm:px-8">
          {loading ? (
            <div className="py-24 text-center text-sm text-muted-foreground">
              Loading journal notes...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground">No articles match your search or filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleCategoryClick(null);
                  handleTagClick(null);
                }}
                className="mt-4 text-sm font-semibold text-accent hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Post (only when not searching / filtering) */}
              {!searchQuery && !activeTag && !activeCategory && featured && (
                <article className="group relative border-b border-border pb-16">
                  <Link to={`/blog/${featured.slug}`} className="block">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                      <div className="lg:col-span-7">
                        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                          <span className="text-accent font-semibold uppercase tracking-wider">Featured Note</span>
                          <span>•</span>
                          <span>{featured.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> {featured.read_minutes} min read
                          </span>
                        </div>
                        <h2 className="font-display text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent sm:text-3xl lg:text-4xl">
                          {featured.title}
                        </h2>
                        <p className="mt-4 font-serif text-base leading-relaxed text-muted-foreground">
                          {featured.excerpt}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-2">
                          {featured.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      {featured.cover && (
                        <div className="lg:col-span-5 overflow-hidden rounded-xl border border-border bg-card">
                          <img
                            src={featured.cover}
                            alt={featured.title}
                            className="aspect-16/10 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              )}

              {/* Grid of articles */}
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-card/40 p-6 transition-all hover:border-accent/40 hover:bg-card/70"
                  >
                    <div>
                      {post.cover && (
                        <Link to={`/blog/${post.slug}`} className="mb-5 block overflow-hidden rounded-lg border border-border">
                          <img
                            src={post.cover}
                            alt={post.title}
                            className="aspect-16/10 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      )}
                      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" /> {post.read_minutes} min
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-2.5 font-serif text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        Read <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
