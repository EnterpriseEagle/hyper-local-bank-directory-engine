"use client";

import { ReactNode } from "react";

interface AffiliateLinkProps {
  href: string;
  offerId: string;
  placement: string;
  className?: string;
  children: ReactNode;
}

export function AffiliateLink({
  href,
  offerId,
  placement,
  className,
  children,
}: AffiliateLinkProps) {
  function handleClick() {
    // Fire a custom event for any analytics provider
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        offer_id: offerId,
        placement,
        url: href,
      });
    }
    // Also log to console for debugging
    console.log("[affiliate_click]", { offerId, placement, href });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

// Extend Window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
