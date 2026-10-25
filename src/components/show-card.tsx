"use client";

import Link from "next/link";
import type { Show } from "@/lib/types";
import { useTrovia } from "@/lib/store";
import { formatViewers } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function ShowCard({ show }: { show: Show }) {
  const { getSeller, lots } = useTrovia();
  const seller = getSeller(show.sellerId);
  const lot = show.currentLotId ? lots[show.currentLotId] : null;
  const isLive = show.status === "live";

  return (
    <Link
      href={isLive || show.status === "scheduled" ? `/live/${show.id}` : `/live/${show.id}`}
      className="group relative block overflow-hidden rounded-2xl outline-none ring-offset-2 transition duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--trovia-acid)]"
    >
      <div
        className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]"
        style={{
          background: `linear-gradient(145deg, hsl(${show.coverHue} 42% 28%), hsl(${show.coverHue + 40} 35% 12%) 55%, #0a1210)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(212,255,58,0.15),transparent_40%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {isLive ? (
            <Badge className="animate-pulse-live border-0 bg-[var(--trovia-coral)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Live
            </Badge>
          ) : show.status === "scheduled" ? (
            <Badge
              variant="secondary"
              className="border-0 bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white backdrop-blur"
            >
              Soon
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="border-0 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/70"
            >
              Ended
            </Badge>
          )}
          {isLive && (
            <span className="rounded-full bg-black/35 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur">
              {formatViewers(show.viewers)} watching
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="font-display text-xl leading-tight tracking-tight sm:text-2xl">
            {show.title}
          </p>
          <p className="mt-0.5 text-xs text-white/65">{show.titleHi}</p>
          <p className="mt-3 text-sm text-white/85">
            {seller?.displayName}
            <span className="text-white/45"> · {seller?.city}</span>
          </p>
          {lot && isLive && (
            <p className="mt-1 truncate text-xs text-[var(--trovia-acid)]">
              Now: {lot.title}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
