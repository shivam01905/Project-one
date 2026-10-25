"use client";

import { useEffect, useRef } from "react";
import type { Lot, Show } from "@/lib/types";
import { formatInr } from "@/lib/format";
import { cn } from "@/lib/utils";

function statusChip(lot: Lot, isCurrent: boolean) {
  if (isCurrent && lot.status === "live") return "Now";
  if (lot.status === "queued") return "Up next";
  if (lot.status === "sold") return "Sold";
  if (lot.status === "passed") return "Passed";
  if (lot.status === "live") return "Live";
  return lot.status;
}

export function LotsTray({
  show,
  lots,
  activeLotId,
  onJump,
  variant = "live",
}: {
  show: Show;
  lots: Record<string, Lot>;
  activeLotId: string | null;
  onJump: (lotId: string) => void;
  variant?: "live" | "vod";
}) {
  const showLots = show.lotIds.map((id) => lots[id]).filter(Boolean);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeLotId || !scroller.current) return;
    const el = scroller.current.querySelector<HTMLElement>(
      `[data-lot-id="${activeLotId}"]`,
    );
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeLotId]);

  if (showLots.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between gap-2 px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
          {variant === "vod" ? "Shoppable moments" : "Upcoming lots"}
        </p>
        <p className="text-[10px] text-white/40">
          {showLots.length} lot{showLots.length === 1 ? "" : "s"} · tap to jump
        </p>
      </div>
      <div
        ref={scroller}
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {showLots.map((lot, i) => {
          const isCurrent = lot.id === activeLotId;
          const chip = statusChip(lot, isCurrent);
          return (
            <button
              key={lot.id}
              type="button"
              data-lot-id={lot.id}
              onClick={() => onJump(lot.id)}
              className={cn(
                "animate-tray-in relative w-[7.5rem] shrink-0 overflow-hidden rounded-xl border text-left transition",
                isCurrent
                  ? "border-[var(--trovia-acid)]/70 bg-black/55 ring-1 ring-[var(--trovia-acid)]/40"
                  : "border-white/15 bg-black/40 hover:border-white/35 hover:bg-black/55",
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className="h-14 w-full"
                style={{
                  background: `linear-gradient(135deg, hsl(${lot.imageHue} 42% 38%), hsl(${lot.imageHue + 24} 28% 16%))`,
                }}
              />
              <div className="space-y-0.5 p-2">
                <span
                  className={cn(
                    "inline-block rounded px-1 py-px text-[9px] font-bold uppercase tracking-wider",
                    chip === "Now" || chip === "Live"
                      ? "bg-[var(--trovia-coral)] text-white"
                      : chip === "Sold"
                        ? "bg-[var(--trovia-acid)]/90 text-[var(--trovia-ink)]"
                        : "bg-white/15 text-white/80",
                  )}
                >
                  {chip}
                </span>
                <p className="line-clamp-2 text-[11px] font-medium leading-snug text-white/95">
                  {lot.title}
                </p>
                <p className="text-[10px] text-white/55">
                  {lot.status === "sold"
                    ? formatInr(lot.currentBid)
                    : `from ${formatInr(lot.startingBid)}`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
