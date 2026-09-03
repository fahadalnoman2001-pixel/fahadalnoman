import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import {
  ArrowLeft,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Sparkles,
  Send,
  Share2,
  Link as LinkIcon,
  Loader2,
  Clock,
  Calendar,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { AffiliateDisclosure } from "@/components/portfolio/AffiliateDisclosure";
import { toast } from "sonner";
import { AVATAR_URL, CONTACT } from "@/components/portfolio/data";
import {
  fetchPost,
  fetchPosts,
  fetchCategories,
  fetchComments,
  postComment,
  fetchReactions,
  postReaction,
  fetchLikes,
  toggleLike,
  streamAiSummary,
  streamAiAsk,
  type BlogPost,
  type BlogCategory,
  type Comment,
} from "@/api/client";
import { applySeo, SITE_URL } from "@/lib/seo";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'id', 'style'],
    a: [...(defaultSchema.attributes?.a || []), 'target', 'rel', 'href'],
    img: [...(defaultSchema.attributes?.img || []), 'src', 'alt', 'width', 'height', 'loading'],
    code: [...(defaultSchema.attributes?.code || []), 'className'],
  },
};

type TocItem = { id: string; text: string; level: 2 | 3 };
type ChatMessage = { role: "user" | "assistant"; content: string };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const m2 = /^##\s+(.+)$/.exec(line);
    const m3 = /^###\s+(.+)$/.exec(line);
    if (m2) items.push({ id: slugify(m2[1]), text: m2[1], level: 2 });
    else if (m3) items.push({ id: slugify(m3[1]), text: m3[1], level: 3 });
  }
  return items;
}

function parseFaq(markdown: string): { question: string; answer: string }[] {
  if (!markdown) return [];
  const faqMatch = /##\s+(?:FAQ|Frequently Asked Questions)[\r\n]+([\s\S]*?)(?=(?:[\r\n]##\s+[^\r\n]+)|$)/i.exec(markdown);
  if (!faqMatch || !faqMatch[1]) return [];

  const faqContent = faqMatch[1].trim();
  const items: { question: string; answer: string }[] = [];

  const pattern = /(?:###\s+([^\r\n]+)|\*\*(?:Q:\s*|\d+\.\s*)?([^\*\r\n]+)\*\*)[\r\n]+([\s\S]*?)(?=(?:###\s+[^\r\n]+|\*\*(?:Q:\s*|\d+\.\s*)?[^\*\r\n]+\*\*)|$)/gi;
  let match;
  while ((match = pattern.exec(faqContent)) !== null) {
    const rawQ = (match[1] || match[2] || '').trim();
    const question = rawQ.endsWith('?') ? rawQ : rawQ + '?';
    const answer = (match[3] || '').trim().replace(/^[\r\n]+|[\r\n]+$/g, '').replace(/\r?\n/g, ' ');
    if (question.length > 3 && answer.length > 3) {
      items.push({ question, answer });
    }
  }
  return items;
}

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  } catch {
    return dateStr || "";
  }
}

function toIso8601String(dateStr?: string | null): string {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({
    fire: 0, idea: 0, clap: 0, love: 0,
  });
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({
    fire: false, idea: false, clap: false, love: false,
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [cName, setCName] = useState("");
  const [cMsg, setCMsg] = useState("");

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const toc = useMemo(() => (post ? extractToc(post.content) : []), [post]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setAiOpen(false);
    setSummary("");
    setChat([]);

    Promise.all([fetchPost(slug), fetchCategories().catch(() => [])])
      .then(([data, cats]) => {
        setPost(data);

        // Resolve matched category
        const matchedCat = cats.find(
          (c: BlogCategory) =>
            c.id === data.category_id ||
            c.slug === data.category?.slug ||
            (data.tags && data.tags.includes(c.slug))
        );
        if (matchedCat) {
          setCategory(matchedCat);
        }

        const titleText = data.seo_meta?.meta_title || `${data.title} — Fahad Al Noman`;
        const descriptionText = data.seo_meta?.meta_description || data.excerpt;
        const path = data.seo_meta?.canonical
          ? data.seo_meta.canonical.replace(SITE_URL, "")
          : `/blog/${data.slug}`;
        const rawImage = data.seo_meta?.og_image || data.cover || undefined;
        const absoluteImage = rawImage && rawImage !== "/blog/placeholder.jpg"
          ? rawImage.startsWith("http")
            ? rawImage
            : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
          : undefined;

        const publishedIso = toIso8601String(data.published_at || data.date || data.created_at);
        const modifiedIso = data.updated_at ? toIso8601String(data.updated_at) : publishedIso;
        const faqs = parseFaq(data.content);
        const categoryName = matchedCat?.name || (data.tags && data.tags[0]) || undefined;

        const breadcrumbs = [
          { name: "Home", url: "/" },
          {
            name: categoryName || "Journal",
            url: matchedCat ? `/blog?category=${matchedCat.slug}` : "/blog",
          },
          {
            name: data.title,
            url: `/blog/${data.slug}`,
          },
        ];

        applySeo({
          title: titleText,
          description: descriptionText,
          path,
          ogType: "article",
          ogImage: absoluteImage,
          keywords: data.seo_meta?.keywords || data.tags || [],
          tags: data.tags || [],
          category: categoryName,
          publishedTime: publishedIso,
          modifiedTime: modifiedIso,
          author: data.author || "Fahad Al Noman",
          authorUrl: `${SITE_URL}/about`,
          breadcrumbs,
          faqs,
          noindex: data.seo_meta?.noindex ?? false,
        });

        return fetchComments(slug);
      })
      .then((cs) => { setComments(cs); return fetchReactions(slug); })
      .then((r) => { setReactions(r.counts); setUserReactions(r.user_reactions); return fetchLikes(slug); })
      .then((l) => { setLikes(l.count); setLiked(l.user_liked); return fetchPosts(); })
      .then(setAllPosts)
      .catch((err) => {
        console.error("Error loading post:", err);
        toast.error("Failed to load article");
        navigate("/blog");
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  useEffect(() => {
    if (!articleRef.current || !post) return;
    const headings = Array.from(articleRef.current.querySelectorAll("h2, h3")) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId((visible.target as HTMLElement).id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [post]);

  async function handleLike() {
    if (!slug) return;
    try {
      const data = await toggleLike(slug);
      setLikes(data.count); setLiked(data.liked);
    } catch { toast.error("Could not register like."); }
  }
  async function handleReact(type: string) {
    if (!slug) return;
    try {
      const data = await postReaction(slug, type);
      setReactions((p) => ({ ...p, [type]: data.count }));
      setUserReactions((p) => ({ ...p, [type]: data.reacted }));
    } catch { toast.error("Could not register reaction."); }
  }

  function runSummary() {
    if (!slug) return;
    setAiOpen(true); setSummary(""); setSummaryLoading(true);
    streamAiSummary(slug,
      (chunk) => setSummary((s) => s + chunk),
      () => setSummaryLoading(false),
      (err) => { console.error(err); toast.error("Could not generate summary."); setSummaryLoading(false); }
    );
  }

  function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return;
    const q = question.trim();
    if (!q || askLoading) return;
    setAiOpen(true); setQuestion("");
    const history = chat.slice(-8);
    setChat((c) => [...c, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setAskLoading(true);
    streamAiAsk(slug, q, history,
      (chunk) => setChat((c) => {
        const next = [...c];
        next[next.length - 1] = { role: "assistant", content: next[next.length - 1].content + chunk };
        return next;
      }),
      () => setAskLoading(false),
      (err) => {
        console.error(err);
        setChat((c) => {
          const next = [...c];
          next[next.length - 1] = { role: "assistant", content: "Sorry — could not reach the AI. Try again." };
          return next;
        });
        setAskLoading(false);
      }
    );
  }

  function share(target: "copy" | "twitter" | "linkedin" | "whatsapp" | "native") {
    if (!post) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${post.title} — by Fahad Al Noman`;
    if (target === "native" && typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url }).catch(() => {});
      return;
    }
    if (target === "copy") {
      navigator.clipboard?.writeText(url).then(
        () => toast.success("Link copied"),
        () => toast.error("Could not copy")
      );
      return;
    }
    const intents: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };
    window.open(intents[target], "_blank", "noopener,noreferrer");
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !cName.trim() || !cMsg.trim()) return;
    try {
      const data = await postComment(slug, { name: cName.trim(), message: cMsg.trim() });
      setComments((prev) => [data, ...prev]);
      setCMsg("");
      toast.success("Comment posted");
    } catch { toast.error("Could not post comment."); }
  }

  const related = useMemo(() => {
    if (!post) return [];
    return allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  }, [post, allPosts]);

  const REACTIONS = [
    { key: "fire", emoji: "🔥", label: "Insightful" },
    { key: "idea", emoji: "💡", label: "Useful" },
    { key: "clap", emoji: "👏", label: "Well written" },
    { key: "love", emoji: "❤️", label: "Loved it" },
  ] as const;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Loading article
          </span>
        </div>
      </div>
    );
  }
  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Post not found</h1>
          <p className="mt-3 text-muted-foreground">That article does not exist (or it moved).</p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const publishedIso = post ? toIso8601String(post.published_at || post.date || post.created_at) : "";
  const updatedIso = post?.updated_at ? toIso8601String(post.updated_at) : null;
  const publishedFormatted = post ? formatDisplayDate(post.published_at || post.date || post.created_at) : "";
  const updatedFormatted = updatedIso ? formatDisplayDate(post?.updated_at) : "";
  const isDifferentDate = Boolean(
    updatedIso &&
    publishedIso &&
    (new Date(updatedIso).getTime() - new Date(publishedIso).getTime() > 86400000 ||
      publishedFormatted !== updatedFormatted)
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Nav />

      {/* Reading progress — 2px subtle bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent"
      />

      <main className="pt-24 pb-24">
        {/* ── Article masthead ─────────────────────────────── */}
        <header className="mx-auto max-w-3xl px-6 sm:px-8">
          <nav aria-label="Breadcrumbs" className="mb-8">
            <ol className="inline-flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              <li className="text-border">/</li>
              <li>
                <Link to="/blog" className="transition-colors hover:text-accent">
                  Journal
                </Link>
              </li>
              {category ? (
                <>
                  <li className="text-border">/</li>
                  <li>
                    <Link
                      to={`/blog?category=${category.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {category.name}
                    </Link>
                  </li>
                </>
              ) : post.tags[0] ? (
                <>
                  <li className="text-border">/</li>
                  <span>{post.tags[0]}</span>
                </>
              ) : null}
            </ol>
          </nav>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            {post.title}
          </h1>

          <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-border py-5">
            <div className="flex items-center gap-3">
              <img
                src={AVATAR_URL}
                alt="Fahad Al Noman"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="text-sm">
                <div className="font-semibold text-foreground">Fahad Al Noman</div>
                <div className="text-xs text-muted-foreground">Full-Stack Developer & DevOps Engineer, Malta</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Published:</span>
                <time dateTime={publishedIso}>{publishedFormatted}</time>
              </span>
              {isDifferentDate && (
                <span className="inline-flex items-center gap-1.5 border-l border-border pl-3 sm:pl-4">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Updated:</span>
                  <time dateTime={updatedIso}>{updatedFormatted}</time>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 border-l border-border pl-3 sm:pl-4">
                <Clock className="h-3.5 w-3.5" /> {post.read_minutes} min read
              </span>
            </div>
          </div>

          {post.has_affiliate_links !== false && (
            <AffiliateDisclosure className="mt-6" />
          )}
        </header>

        {/* ── Cover ─────────────────────────────────────────── */}
        {post.cover && post.cover !== "/blog/placeholder.jpg" && (
          <figure className="mx-auto mt-10 max-w-5xl px-6 sm:px-8">
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <img
                src={post.cover}
                alt={post.title}
                width={1600}
                height={900}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </figure>
        )}

        {/* ── Body ─────────────────────────────────────────── */}
        <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          {/* Article */}
          <article
            ref={articleRef}
            className="mx-auto w-full min-w-0 max-w-[720px] overflow-hidden break-words lg:mx-0"
          >
            <div className="prose-journal">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                components={{
                  h1: ({ children, ...props }) => {
                    const t = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : String(children);
                    return <h2 id={slugify(t)} className="scroll-mt-24 break-words" {...props}>{children}</h2>;
                  },
                  h2: ({ children, ...props }) => {
                    const t = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : String(children);
                    return <h2 id={slugify(t)} className="scroll-mt-24 break-words" {...props}>{children}</h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const t = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : String(children);
                    return <h3 id={slugify(t)} className="scroll-mt-24 break-words" {...props}>{children}</h3>;
                  },
                  h4: ({ children, ...props }) => {
                    return <h4 className="break-words" {...props}>{children}</h4>;
                  },
                  p: ({ children, ...props }) => {
                    return <p className="break-words" {...props}>{children}</p>;
                  },
                  a: ({ href, children, ...props }) => {
                    const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
                    return (
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-accent underline underline-offset-4 hover:text-accent/80 break-words"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  code: CodeBlock,
                  table: ({ children, ...props }) => {
                    return (
                      <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
                        <table className="w-full border-collapse text-left text-sm" {...props}>
                          {children}
                        </table>
                      </div>
                    );
                  },
                  img: ({ src, alt, ...props }) => {
                    return (
                      <img
                        src={src}
                        alt={alt || ''}
                        loading="lazy"
                        className="my-6 h-auto max-w-full rounded-xl border border-border shadow-xs"
                        {...props}
                      />
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Reactions — subtle, single row */}
            <div className="mt-16 border-t border-border pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Was this useful?
                </span>
                {REACTIONS.map((r) => {
                  const on = userReactions[r.key];
                  return (
                    <button
                      key={r.key}
                      onClick={() => handleReact(r.key)}
                      title={r.label}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                        on
                          ? "border-accent/60 bg-accent/10 text-accent"
                          : "border-border bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground"
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span className="font-mono">{reactions[r.key] ?? 0}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Author card */}
            <div className="mt-10 rounded-lg border border-border bg-surface p-6">
              <div className="flex items-start gap-5">
                <img
                  src={AVATAR_URL}
                  alt="Fahad Al Noman"
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    Written by
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-foreground">
                    Fahad Al Noman
                  </div>
                  <p className="mt-2 font-serif text-[15px] leading-relaxed text-muted-foreground">
                    Full-stack developer and DevOps engineer based in Qormi, Malta. Six years
                    building marketplaces, deploying production infrastructure, and growing
                    organic traffic for clients across Europe and Asia.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <Link to="/about" className="font-semibold text-accent hover:underline underline-offset-4">
                      About →
                    </Link>
                    <Link to="/services" className="font-semibold text-accent hover:underline underline-offset-4">
                      Services →
                    </Link>
                    <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <section id="comments" className="mt-12 border-t border-border pt-10">
              <h2 className="font-display text-xl font-bold text-foreground">
                Discussion <span className="font-normal text-muted-foreground">({comments.length})</span>
              </h2>

              <form onSubmit={addComment} className="mt-6 space-y-3">
                <input
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="Your name"
                  maxLength={60}
                  className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent/60"
                />
                <textarea
                  value={cMsg}
                  onChange={(e) => setCMsg(e.target.value)}
                  placeholder="Share a thought…"
                  maxLength={1000}
                  rows={4}
                  className="w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent/60"
                />
                <button
                  type="submit"
                  disabled={!cName.trim() || !cMsg.trim()}
                  className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Post comment <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              <ul className="mt-8 space-y-6">
                {comments.map((c) => (
                  <li key={c.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-foreground">{c.name}</span>
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap font-serif text-[16px] leading-relaxed text-foreground/85">
                      {c.message}
                    </p>
                  </li>
                ))}
                {comments.length === 0 && (
                  <li className="text-center font-serif text-[15px] italic text-muted-foreground">
                    No comments yet — be the first.
                  </li>
                )}
              </ul>
            </section>
          </article>

          {/* Right rail — sticky TOC + share */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {toc.length > 0 && (
                <div>
                  <div className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    In this article
                  </div>
                  <ul className="border-l border-border">
                    {toc.map((t) => (
                      <li key={t.id} className={t.level === 3 ? "pl-3" : ""}>
                        <a
                          href={`#${t.id}`}
                          className={`-ml-px block border-l-2 py-1 pl-3 text-sm leading-snug transition-colors ${
                            activeId === t.id
                              ? "border-accent font-semibold text-foreground"
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Actions
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleLike}
                    className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                      liked
                        ? "border-accent/60 bg-accent/10 text-accent"
                        : "border-border bg-surface text-foreground hover:border-accent/40"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                    <span>{likes} {likes === 1 ? "like" : "likes"}</span>
                  </button>
                  <a
                    href="#comments"
                    className="flex w-full items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground hover:border-accent/40"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
                  </a>
                  <button
                    onClick={runSummary}
                    className="flex w-full items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground hover:border-accent/40"
                  >
                    {summaryLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Sparkles className="h-4 w-4" />
                    }
                    <span>Summarise with AI</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Share
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <ShareBtn onClick={() => share("copy")} label="Copy link"><LinkIcon className="h-3.5 w-3.5" /></ShareBtn>
                  <ShareBtn onClick={() => share("twitter")} label="Share on X">𝕏</ShareBtn>
                  <ShareBtn onClick={() => share("linkedin")} label="Share on LinkedIn">in</ShareBtn>
                  <ShareBtn onClick={() => share("whatsapp")} label="Share on WhatsApp"><Share2 className="h-3.5 w-3.5" /></ShareBtn>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── AI drawer (only rendered when opened) ────────── */}
        {aiOpen && (
          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface shadow-editorial lg:right-4 lg:bottom-4 lg:left-auto lg:w-[420px] lg:rounded-lg lg:border">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                <Sparkles className="h-3.5 w-3.5" /> AI · grounded in this article
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
              {(summary || summaryLoading) && (
                <div className="mb-4">
                  <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    TL;DR
                  </div>
                  {summaryLoading && !summary ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Summarising…
                    </div>
                  ) : (
                    <div className="text-[15px] leading-relaxed text-foreground/90 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
              {chat.length > 0 && (
                <div className="mb-3 space-y-3">
                  {chat.map((m, i) => (
                    <div
                      key={i}
                      className={`rounded-md px-3 py-2 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "ml-auto max-w-[85%] bg-accent text-accent-foreground"
                          : "max-w-[95%] bg-surface-2 text-foreground"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:ml-5 [&_ul]:list-disc">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || "…"}</ReactMarkdown>
                        </div>
                      ) : m.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <form onSubmit={ask} className="flex items-center gap-2 border-t border-border p-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about this article…"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={askLoading || !question.trim()}
                className="grid h-9 w-9 place-items-center rounded-md bg-foreground text-background disabled:opacity-40"
              >
                {askLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
          </div>
        )}

        {/* ── Mobile action bar ────────────────────────────── */}
        <div className="fixed inset-x-0 bottom-3 z-40 mx-3 flex items-center justify-around gap-1 rounded-full border border-border bg-background/95 px-2 py-1.5 shadow-editorial backdrop-blur-xl lg:hidden">
          <MobileBtn onClick={handleLike} active={liked}>
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          </MobileBtn>
          <MobileBtn onClick={() => (document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" }))}>
            <MessageCircle className="h-4 w-4" />
          </MobileBtn>
          <MobileBtn onClick={runSummary}>
            {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </MobileBtn>
          <MobileBtn onClick={() => share("native")}>
            <Share2 className="h-4 w-4" />
          </MobileBtn>
        </div>

        {/* ── Related ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mx-auto mt-24 max-w-6xl px-6 sm:px-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                ▸ Read next
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                  <div className="mb-4 aspect-[16/10] overflow-hidden rounded-md border border-border bg-surface">
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    {p.date} · {p.read_minutes} min
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    Read <ArrowUpRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function MobileBtn({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
        active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

function ShareBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-sm font-semibold text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
    >
      {children}
    </button>
  );
}

function CodeBlock({ children, className, ...props }: React.ComponentPropsWithoutRef<'code'> & { className?: string }) {
  const [copied, setCopied] = useState(false);
  const isInline = !className;

  if (isInline) {
    return (
      <code
        className="rounded border border-accent/15 bg-accent/8 px-1.5 py-0.5 font-mono text-[0.88em] text-foreground break-all whitespace-pre-wrap"
        {...props}
      >
        {children}
      </code>
    );
  }

  const rawCode = String(children).replace(/\n$/, '');

  const copyCode = () => {
    navigator.clipboard?.writeText(rawCode).then(() => {
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="flex items-center justify-between border-b border-border/60 bg-surface px-4 py-1.5 text-xs font-mono text-muted-foreground">
        <span>{className?.replace('language-', '') || 'code'}</span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground max-w-full">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

