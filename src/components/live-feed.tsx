"use client";

import { useRouter } from "next/navigation";
import { useTrovia } from "@/lib/store";
import { formatInr, formatViewers } from "@/lib/format";
import type { Show } from "@/lib/types";
import Link from "next/link";

function FeedSlide({ show }: { show: Show }) {
  const { getSeller, lots, bids } = useTrovia();
  const router = useRouter();
  const seller = getSeller(show.sellerId);
  const lot = show.currentLotId ? lots[show.currentLotId] : null;
  const recentBids = bids.filter((b) => b.showId === show.id).length;
  const endingSoon =
    lot?.endsAt != null && lot.endsAt - Date.now() < 12_000 && lot.status === "live";

  return (
    <section
      className="relative h-[min(92dvh,820px)] w-full shrink-0 snap-start snap-always overflow-hidden rounded-[1.5rem]"
      style={{
        background: `linear-gradient(165deg, hsl(${show.coverHue} 40% 26%), #050a08 52%, hsl(${show.coverHue + 35} 28% 12%))`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-55 [background:radial-gradient(ellipse_at_30%_15%,rgba(212,255,58,0.2),transparent_48%),radial-gradient(ellipse_at_80%_85%,rgba(255,90,60,0.14),transparent_42%)]" />
      <div className="animate-grain pointer-events-none absolute inset-0 opacity-[0.1]" />

      <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
        <span className="animate-pulse-live inline-flex items-center gap-1.5 rounded-md bg-[var(--trovia-coral)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </span>
        <span className="rounded-md bg-black/45 px-2 py-1 text-[10px] text-white/90 backdrop-blur">
          {formatViewers(show.viewers)} watching
        </span>
        {endingSoon && (
          <span className="animate-urgency rounded-md bg-[var(--trovia-acid)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--trovia-ink)]">
            Ending soon
          </span>
        )}
        {recentBids > 0 && (
          <span className="rounded-md bg-black/45 px-2 py-1 text-[10px] text-white/85 backdrop-blur">
            {Math.min(recentBids, 9)}+ bids in room
          </span>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="animate-float h-[48%] w-[38%] max-w-[220px] rounded-[1.75rem] border border-white/10 shadow-2xl"
          style={{
            background: lot
              ? `linear-gradient(145deg, hsl(${lot.imageHue} 48% 44%), hsl(${lot.imageHue + 25} 32% 16%))`
              : "linear-gradient(145deg,#2a3a34,#121a18)",
          }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-5 pb-6 pt-24 text-white">
        <p className="font-display text-3xl leading-none tracking-tight sm:text-4xl">
          {show.title}
        </p>
        <p className="mt-1 text-sm text-white/65">{show.titleHi}</p>
        <p className="mt-3 text-sm text-white/90">
          {seller?.displayName}
          <span className="text-white/45"> · {seller?.city}</span>
        </p>
        {lot && (
          <p className="mt-2 truncate text-sm text-[var(--trovia-acid)]">
            Now · {lot.title}
            {lot.status === "live" ? ` · ${formatInr(lot.currentBid)}` : ""}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/live/${show.id}`)}
            className="inline-flex h-11 items-center rounded-full bg-[var(--trovia-acid)] px-5 text-sm font-semibold text-[var(--trovia-ink)]"
          >
            Jump in · अंदर आओ
          </button>
          <span className="text-xs text-white/50">Swipe for next live ↓</span>
        </div>
      </div>
    </section>
  );
}

/** Vertical Reels-style live discovery — stay in the vibe */
export function LiveFeed() {
  const { shows, loading } = useTrovia();
  const live = shows.filter((s) => s.status === "live");

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-[min(70dvh,640px)] animate-pulse rounded-[1.5rem] bg-[var(--trovia-ink)]/10"
          />
        ))}
      </div>
    );
  }

  if (live.length === 0) {
    return (
      <div className="flex h-[min(60dvh,520px)] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--trovia-ink)]/20 bg-gradient-to-b from-white/40 to-[var(--trovia-panel)]/50 px-6 text-center">
        <p className="font-display text-2xl">Feed&apos;s quiet — room still warm</p>
        <p className="mt-2 max-w-sm text-sm text-[var(--trovia-muted)]">
          कोई लाइव नहीं अभी · peek upcoming drops or go live as a curated seller.
          Don&apos;t bounce to WA — stay on Trovia.
        </p>
        <Link
          href="/seller"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-[var(--trovia-acid)] px-4 text-sm font-semibold text-[var(--trovia-ink)]"
        >
          Go live
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-h-[min(92dvh,820px)] flex-col gap-3 overflow-y-auto overscroll-y-contain snap-y snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {live.map((show) => (
        <FeedSlide key={show.id} show={show} />
      ))}
    </div>
  );
}
