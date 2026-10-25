"use client";

import { useTrovia } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FollowButton({
  sellerId,
  variant = "light",
  size = "md",
}: {
  sellerId: string;
  variant?: "light" | "dark";
  size?: "sm" | "md";
}) {
  const { isFollowing, toggleFollow } = useTrovia();
  const on = isFollowing(sellerId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleFollow(sellerId);
      }}
      className={cn(
        "rounded-full font-semibold transition",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs",
        on
          ? variant === "dark"
            ? "border border-white/30 bg-white/15 text-white"
            : "border border-[var(--trovia-ink)]/20 bg-[var(--trovia-ink)]/5 text-[var(--trovia-ink)]"
          : variant === "dark"
            ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
            : "bg-[var(--trovia-ink)] text-[var(--trovia-paper)]",
      )}
    >
      {on ? "Following · ✓" : "Follow · फॉलो"}
    </button>
  );
}
