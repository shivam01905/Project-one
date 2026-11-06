"use client";

import type { Seller } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TrustBadge({
  seller,
  variant = "dark",
  size = "sm",
}: {
  seller: Seller;
  variant?: "dark" | "light";
  size?: "sm" | "md";
}) {
  const verified = seller.verified && seller.kycStatus === "verified";
  const dark = variant === "dark";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-semibold uppercase tracking-wider",
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]",
        verified
          ? dark
            ? "bg-[var(--trovia-acid)]/20 text-[var(--trovia-acid)]"
            : "bg-[var(--trovia-acid-ink)]/10 text-[var(--trovia-acid-ink)]"
          : dark
            ? "bg-white/10 text-white/60"
            : "bg-[var(--trovia-ink)]/8 text-[var(--trovia-muted)]",
      )}
      title={seller.kycLabel}
    >
      {verified ? (
        <svg
          viewBox="0 0 16 16"
          className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")}
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 1.5 9.8 3l2.1.4-.1 2.2L13.5 8l-1.7 1.4.1 2.2-2.1.4L8 13.5 6.2 12l-2.1-.4.1-2.2L2.5 8l1.7-1.4-.1-2.2 2.1-.4L8 1.5Zm-.2 8.3 3.4-3.4-.9-.9-2.5 2.5-1.2-1.2-.9.9 2.1 2.1Z" />
        </svg>
      ) : null}
      {verified ? "Verified KYC" : "KYC pending"}
    </span>
  );
}
