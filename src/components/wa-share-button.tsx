"use client";

import { whatsappShareUrl } from "@/lib/share";
import { cn } from "@/lib/utils";

export function WaShareButton({
  text,
  label = "Share WA",
  variant = "dark",
  className,
}: {
  text: string;
  label?: string;
  variant?: "dark" | "light" | "acid";
  className?: string;
}) {
  return (
    <a
      href={whatsappShareUrl(text)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
        variant === "dark" &&
          "border border-white/25 bg-black/40 text-white backdrop-blur hover:bg-black/55",
        variant === "light" &&
          "border border-[var(--trovia-ink)]/15 bg-white/50 text-[var(--trovia-ink)] hover:bg-white/80",
        variant === "acid" &&
          "bg-[var(--trovia-acid)] text-[var(--trovia-ink)] hover:bg-[var(--trovia-acid)]/90",
        className,
      )}
    >
      {label}
    </a>
  );
}
