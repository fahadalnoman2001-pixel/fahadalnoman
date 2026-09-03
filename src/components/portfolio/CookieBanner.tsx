import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check } from "lucide-react";
import { saveCookieConsent } from "@/api/client";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const consentSet = localStorage.getItem("cookie_consent_set");
    if (!consentSet) {
      // Delay slightly for premium entry effect
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = async () => {
    try {
      await saveCookieConsent({
        accepted_all: true,
        analytics_allowed: true,
        marketing_allowed: true,
      });
    } catch (err) {
      console.error("Failed to save cookie consent to server:", err);
    }
    localStorage.setItem("cookie_consent_set", "accepted_all");
    localStorage.setItem("cookie_analytics_allowed", "true");
    localStorage.setItem("cookie_marketing_allowed", "true");
    window.dispatchEvent(new Event("cookieConsentUpdated"));
    setVisible(false);
  };

  const handleDeclineAll = async () => {
    try {
      await saveCookieConsent({
        accepted_all: false,
        analytics_allowed: false,
        marketing_allowed: false,
      });
    } catch (err) {
      console.error("Failed to save cookie consent to server:", err);
    }
    localStorage.setItem("cookie_consent_set", "declined_all");
    localStorage.setItem("cookie_analytics_allowed", "false");
    localStorage.setItem("cookie_marketing_allowed", "false");
    window.dispatchEvent(new Event("cookieConsentUpdated"));
    setVisible(false);
  };

  const handleSavePreferences = async () => {
    const acceptedAll = analytics && marketing;
    try {
      await saveCookieConsent({
        accepted_all: acceptedAll,
        analytics_allowed: analytics,
        marketing_allowed: marketing,
      });
    } catch (err) {
      console.error("Failed to save cookie consent to server:", err);
    }
    localStorage.setItem(
      "cookie_consent_set",
      acceptedAll ? "accepted_all" : "custom"
    );
    localStorage.setItem("cookie_analytics_allowed", analytics ? "true" : "false");
    localStorage.setItem("cookie_marketing_allowed", marketing ? "true" : "false");
    window.dispatchEvent(new Event("cookieConsentUpdated"));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 left-5 md:left-auto md:max-w-md z-[100] overflow-hidden rounded-2xl border border-border bg-surface/90 backdrop-blur-xl p-5 shadow-2xl"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
                  <Cookie className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">Cookie Preferences</h4>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">Privacy Shield Active</p>
                </div>
              </div>
              <button
                onClick={handleDeclineAll}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-slate-100/50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-muted-foreground">
              We use cookies to personalize content, audit traffic view metrics, and run marketing tools to boost our website services.
            </p>

            {/* Custom Settings Toggles */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-border pt-4 space-y-3.5"
                >
                  {/* Essential */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Essential Cookies</h5>
                      <p className="text-[10px] text-slate-400">Required for website features to function. Cannot be turned off.</p>
                    </div>
                    <div className="h-5 w-8 rounded-full bg-accent/20 flex items-center justify-end px-1 text-accent">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Performance & Analytics</h5>
                      <p className="text-[10px] text-slate-400">Used to measure visitor pages traffic trends on the Admin Dashboard.</p>
                    </div>
                    <button
                      onClick={() => setAnalytics(!analytics)}
                      className={`h-5 w-9 rounded-full transition-colors relative flex items-center px-0.5 ${
                        analytics ? "bg-accent" : "bg-slate-200"
                      }`}
                    >
                      <motion.div
                        layout
                        className="h-4 w-4 rounded-full bg-white shadow-sm"
                        animate={{ x: analytics ? 16 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Marketing & Targeting</h5>
                      <p className="text-[10px] text-slate-400">Powers campaigns and ad tracking tools to boost site outreach.</p>
                    </div>
                    <button
                      onClick={() => setMarketing(!marketing)}
                      className={`h-5 w-9 rounded-full transition-colors relative flex items-center px-0.5 ${
                        marketing ? "bg-accent" : "bg-slate-200"
                      }`}
                    >
                      <motion.div
                        layout
                        className="h-4 w-4 rounded-full bg-white shadow-sm"
                        animate={{ x: marketing ? 16 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
              {showSettings ? (
                <>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-glow-sm"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-glow-sm"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleDeclineAll}
                    className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
                    title="Customize"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
