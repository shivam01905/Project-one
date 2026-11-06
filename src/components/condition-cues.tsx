"use client";

import type { Lot } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ConditionCues({
  lot,
  variant = "overlay",
  compact = false,
}: {
  lot: Lot;
  variant?: "overlay" | "panel";
  compact?: boolean;
}) {
  const cues = lot.conditionCues;
  if (!cues?.length) return null;

  const overlay = variant === "overlay";

  return (
    <div
      className={cn(
        "rounded-xl border backdrop-blur",
        overlay
          ? "border-white/15 bg-black/50 text-white"
          : "border-[var(--trovia-ink)]/10 bg-white/50 text-[var(--trovia-ink)]",
        compact ? "px-2.5 py-2" : "px-3 py-2.5",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p
          className={cn(
            "font-semibold uppercase tracking-[0.14em]",
            compact ? "text-[9px]" : "text-[10px]",
            overlay ? "text-white/55" : "text-[var(--trovia-muted)]",
          )}
        >
          Condition talk · thrift
        </p>
        <span
          className={cn(
            "text-[10px] font-medium",
            overlay ? "text-[var(--trovia-acid)]" : "text-[var(--trovia-acid-ink)]",
          )}
        >
          {lot.condition} · {lot.size}
        </span>
      </div>
      <ul
        className={cn(
          "mt-1.5 grid gap-1",
          compact ? "grid-cols-1" : "sm:grid-cols-2",
        )}
      >
        {cues.map((cue) => (
          <li
            key={cue.id}
            className={cn(
              "flex items-start gap-1.5 text-[11px] leading-snug",
              overlay ? "text-white/80" : "text-[var(--trovia-ink)]/80",
            )}
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold",
                cue.checked
                  ? overlay
                    ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
                    : "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
                  : overlay
                    ? "border border-white/25 text-white/40"
                    : "border border-[var(--trovia-ink)]/20 text-[var(--trovia-muted)]",
              )}
              aria-hidden
            >
              {cue.checked ? "✓" : "·"}
            </span>
            <span>
              {cue.label}
              {cue.labelHi ? (
                <span
                  className={cn(
                    "ml-1",
                    overlay ? "text-white/40" : "text-[var(--trovia-muted)]",
                  )}
                >
                  · {cue.labelHi}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
