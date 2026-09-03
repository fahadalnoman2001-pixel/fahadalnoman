import { useEffect } from "react";
import { applySeo, type SeoOptions } from "@/lib/seo";

/**
 * Sets title/description/canonical/OG/Twitter tags on mount and whenever
 * the page's own SEO values change. For pages whose title depends on an
 * async fetch (e.g. BlogPostPage), call `applySeo()` directly inside the
 * fetch's `.then()` instead of using this hook.
 */
export function useSeo(options: SeoOptions) {
  useEffect(() => {
    applySeo(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.title, options.description, options.path, options.ogType, options.ogImage, options.noindex, JSON.stringify(options.customSchema)]);
}
