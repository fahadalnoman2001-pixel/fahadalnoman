import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { trackPageView, fetchPublicSettings } from "@/api/client";

const HomePage = lazy(() => import("@/pages/HomePage").then(m => ({ default: m.HomePage })));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const BlogListPage = lazy(() => import("@/pages/BlogListPage").then(m => ({ default: m.BlogListPage })));
const TermsPage = lazy(() => import("@/pages/TermsPage").then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const SitemapPage = lazy(() => import("@/pages/SitemapPage").then(m => ({ default: m.SitemapPage })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then(m => ({ default: m.ServicesPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then(m => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import("@/pages/FaqPage").then(m => ({ default: m.FaqPage })));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash (e.g. #about), scroll to that element instead of the top
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function AnalyticsLoader() {
  const { pathname } = useLocation();
  const [consent, setConsent] = useState(() => {
    const consentSet = localStorage.getItem("cookie_consent_set");
    const analytics = localStorage.getItem("cookie_analytics_allowed") === "true";
    const marketing = localStorage.getItem("cookie_marketing_allowed") === "true";
    return {
      set: !!consentSet,
      analytics: consentSet === "accepted_all" || (consentSet === "custom" && analytics),
      marketing: consentSet === "accepted_all" || (consentSet === "custom" && marketing),
    };
  });
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchPublicSettings()
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading public settings:", err));
  }, []);

  // Listen to cookie consent updates
  useEffect(() => {
    const handleConsentChange = () => {
      const consentSet = localStorage.getItem("cookie_consent_set");
      const analytics = localStorage.getItem("cookie_analytics_allowed") === "true";
      const marketing = localStorage.getItem("cookie_marketing_allowed") === "true";
      setConsent({
        set: !!consentSet,
        analytics: consentSet === "accepted_all" || (consentSet === "custom" && analytics),
        marketing: consentSet === "accepted_all" || (consentSet === "custom" && marketing),
      });
    };

    window.addEventListener("cookieConsentUpdated", handleConsentChange);
    return () => window.removeEventListener("cookieConsentUpdated", handleConsentChange);
  }, []);

  // Track page view on route change, but ONLY if analytics is allowed
  useEffect(() => {
    if (consent.analytics) {
      trackPageView(pathname).catch((err) =>
        console.error("Failed to track page view:", err)
      );
    }
  }, [pathname, consent.analytics]);

  // Load integrations based on settings and consent
  useEffect(() => {
    if (!settings) return;

    // 1. Google Search Console Verification (Essential - always safe)
    if (settings.gsc_verification) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "google-site-verification");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", settings.gsc_verification);
    }

    // 2. Bing Webmaster Verification (Essential - always safe)
    if (settings.bing_verification) {
      let meta = document.querySelector('meta[name="msvalidate.01"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "msvalidate.01");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", settings.bing_verification);
    }

    // 3. Pinterest Verification (Essential - always safe)
    if (settings.pinterest_verification) {
      let meta = document.querySelector('meta[name="p:domain_verify"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "p:domain_verify");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", settings.pinterest_verification);
    }

    // 4. Custom CSS Override (Essential - always safe)
    if (settings.custom_css) {
      const styleId = "custom-css-overrides";
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = settings.custom_css;
    }

    // 5. Google Analytics GA4 (Only if analytics consent is granted)
    if (settings.ga_measurement_id && consent.analytics) {
      const scriptId = "ga-script-loader";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga_measurement_id}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement("script");
        inlineScript.id = "ga-inline-script";
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.ga_measurement_id}', { page_path: window.location.pathname });
        `;
        document.head.appendChild(inlineScript);
      } else {
        (window as any).gtag?.("config", settings.ga_measurement_id, {
          page_path: pathname,
        });
      }
    } else if (!consent.analytics) {
      // If consent was revoked, disable or delete GA tracking script from head
      const script = document.getElementById("ga-script-loader");
      script?.remove();
      const inlineScript = document.getElementById("ga-inline-script");
      inlineScript?.remove();
    }

    // 6. Custom Head Scripts (Pixels, styles, etc.) (Only if marketing consent is granted)
    if (settings.head_scripts && consent.marketing) {
      const containerId = "custom-head-scripts";
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.style.display = "none";
        document.body.appendChild(container);
      }
      try {
        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(settings.head_scripts);
        container.innerHTML = "";
        container.appendChild(fragment);
      } catch (e) {
        console.error("Error injecting custom head scripts:", e);
      }
    } else if (!consent.marketing) {
      // If consent was revoked, delete custom head scripts container
      const container = document.getElementById("custom-head-scripts");
      container?.remove();
    }
  }, [settings, consent, pathname]);

  return null;
}

import { CookieBanner } from "@/components/portfolio/CookieBanner";

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsLoader />
      <CookieBanner />
      <Suspense fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            fontFamily: "Inter, sans-serif",
          }
        }} 
      />
    </BrowserRouter>
  );
}
export default App;

