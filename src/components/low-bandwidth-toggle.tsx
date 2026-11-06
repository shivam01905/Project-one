"use client";

import { cn } from "@/lib/utils";

export function LowBandwidthToggle({
  enabled,
  onToggle,
  className,
}: {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      title={
        enabled
          ? "Weak network on — audio + lot stills"
          : "Toggle weak-network / 3G fallback"
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur transition",
        enabled
          ? "border-[var(--trovia-acid)]/45 bg-[var(--trovia-acid)]/20 text-[var(--trovia-acid)]"
          : "border-white/20 bg-black/45 text-white/80 hover:bg-black/60",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          enabled ? "bg-[var(--trovia-acid)]" : "bg-white/40",
        )}
      />
      {enabled ? "3G · audio+stills" : "Weak network"}
    </button>
  );
}
