import { Info } from "lucide-react";

interface AffiliateDisclosureProps {
  className?: string;
}

export function AffiliateDisclosure({ className = "" }: AffiliateDisclosureProps) {
  return (
    <div
      role="note"
      aria-label="Affiliate disclosure"
      className={`flex items-start gap-2.5 rounded-lg border-l-2 border-accent/40 bg-surface-2/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/80" aria-hidden="true" />
      <p>
        <strong className="font-semibold text-foreground/90">Disclosure:</strong> This post contains
        affiliate links. If you buy through them, I may earn a small commission at no extra cost to
        you. I only recommend tools I&apos;d actually use.
      </p>
    </div>
  );
}
