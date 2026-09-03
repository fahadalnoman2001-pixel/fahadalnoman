const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function getSessionId(): string {
  let id = localStorage.getItem("visitor_session_id");
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("visitor_session_id", id);
  }
  return id;
}

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  content: string;
  date: string;
  read_minutes: number;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  weight: number;
  sections?: BlogSection[];
  seo_meta?: SeoMeta;
  author?: string;
  category_id?: number;
  category?: BlogCategory;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  has_affiliate_links?: boolean;
  views?: number;
};

export type BlogSection = {
  heading: string;
  image: string;
  caption: string | null;
  sort_order: number;
};

export type SeoMeta = {
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  canonical: string | null;
  keywords: string[] | null;
  noindex: boolean;
};

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  seo_title?: string | null;
  tags?: string[] | null;
  seo_meta?: SeoMeta | null;
  sort_order?: number;
  blog_posts_count?: number;
};

export type Comment = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export type ContactForm = {
  name: string;
  email: string;
  phone: string;
  whatsapp: boolean;
  message: string;
};

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("X-Session-ID", getSessionId());
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchCategories(): Promise<BlogCategory[]> {
  return apiFetch("/categories");
}

export async function fetchCategory(slug: string): Promise<BlogCategory> {
  return apiFetch(`/categories/${slug}`);
}

export async function fetchPosts(params?: { category?: string; tag?: string }): Promise<BlogPost[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.tag) query.set("tag", params.tag);
  const qStr = query.toString() ? `?${query.toString()}` : "";
  return apiFetch(`/posts${qStr}`);
}

export async function fetchPost(slug: string): Promise<BlogPost> {
  return apiFetch(`/posts/${slug}`);
}

export async function fetchComments(slug: string): Promise<Comment[]> {
  return apiFetch(`/posts/${slug}/comments`);
}

export async function postComment(slug: string, data: { name: string; message: string }): Promise<Comment> {
  return apiFetch(`/posts/${slug}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchReactions(slug: string): Promise<{ counts: Record<string, number>; user_reactions: Record<string, boolean> }> {
  return apiFetch(`/posts/${slug}/reactions`);
}

export async function postReaction(slug: string, type: string): Promise<{ type: string; count: number; reacted: boolean }> {
  return apiFetch(`/posts/${slug}/reactions`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

export async function fetchLikes(slug: string): Promise<{ count: number; user_liked: boolean }> {
  return apiFetch(`/posts/${slug}/likes`);
}

export async function toggleLike(slug: string): Promise<{ count: number; liked: boolean }> {
  return apiFetch(`/posts/${slug}/likes`, {
    method: "POST",
  });
}

export async function submitContact(data: ContactForm): Promise<{ success: boolean; message: string }> {
  return apiFetch("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  return apiFetch("/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Helper function for SSE streams
async function readSseStream(
  url: string,
  body: any,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": getSessionId(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) onChunk(content);
          } catch {
            // If it is raw text rather than JSON stream
            onChunk(data);
          }
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

export function streamAiSummary(
  slug: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  readSseStream("/blog-ai", { slug, mode: "summary" }, onChunk, onDone, onError);
}

export function streamAiAsk(
  slug: string,
  question: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  readSseStream("/blog-ai", { slug, mode: "ask", question, history }, onChunk, onDone, onError);
}

export async function streamTts(
  text: string,
  onChunk: (base64Data: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  // TTS API speech returns SSE events with raw chunks
  try {
    const response = await fetch(`${API_BASE}/blog-tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": getSessionId(),
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          onChunk(data);
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function trackPageView(path: string): Promise<{ status: string }> {
  return apiFetch("/track", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export async function fetchPublicSettings(): Promise<Record<string, string>> {
  return apiFetch("/settings/public");
}

export async function saveCookieConsent(data: {
  accepted_all: boolean;
  analytics_allowed: boolean;
  marketing_allowed: boolean;
}): Promise<{ status: string }> {
  return apiFetch("/cookie-consent", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


