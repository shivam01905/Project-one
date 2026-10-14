"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { StreamStage } from "@/components/stream-stage";
import { LiveChat } from "@/components/live-chat";
import { LotPanel } from "@/components/lot-panel";
import { FollowButton } from "@/components/follow-button";
import { WaShareButton } from "@/components/wa-share-button";
import { useTrovia } from "@/lib/store";
import { formatViewers } from "@/lib/format";
import { shareCopyLot, shareCopyShow, shareCopyWin } from "@/lib/share";
import type { Order } from "@/lib/types";

export default function LiveRoomPage() {
  const params = useParams<{ showId: string }>();
  const showId = params?.showId;
  const router = useRouter();
  const {
    shows,
    lots,
    bids,
    getSeller,
    loading,
    advanceToNextLot,
    liveAlerts,
    dismissLiveAlert,
  } = useTrovia();
  const show = shows.find((s) => s.id === showId);
  const seller = show ? getSeller(show.sellerId) : undefined;
  const lot = show?.currentLotId ? lots[show.currentLotId] : null;

  // Clear “seller is live” remind once you're in the room
  useEffect(() => {
    if (!showId) return;
    for (const a of liveAlerts) {
      if (a.showId === showId) dismissLiveAlert(a.id);
    }
  }, [showId, liveAlerts, dismissLiveAlert]);
  const [winBanner, setWinBanner] = useState<{
    title: string;
    shareText: string;
  } | null>(null);
  const [lotKey, setLotKey] = useState(0);
  const advancedFor = useRef<Set<string>>(new Set());

  const liveShows = useMemo(
    () => shows.filter((s) => s.status === "live"),
    [shows],
  );
  const liveIndex = liveShows.findIndex((s) => s.id === showId);
  const prevShow = liveIndex > 0 ? liveShows[liveIndex - 1] : null;
  const nextShow =
    liveIndex >= 0 && liveIndex < liveShows.length - 1
      ? liveShows[liveIndex + 1]
      : liveShows.find((s) => s.id !== showId) ?? null;

  const biddingPeople = useMemo(() => {
    if (!lot) return 0;
    const recent = bids.filter(
      (b) => b.lotId === lot.id && Date.now() - b.at < 45_000,
    );
    const names = new Set(recent.map((b) => b.user));
    return Math.max(names.size, lot.bidCount > 0 ? Math.min(lot.bidCount, 4) : 0);
  }, [bids, lot]);

  const nextQueued = show
    ? show.lotIds
        .map((id) => lots[id])
        .find(
          (l) =>
            l &&
            l.status === "queued" &&
            l.id !== show.currentLotId,
        )
    : null;

  // Keep watching: auto-advance when lot ends
  useEffect(() => {
    if (!show || !lot) return;
    if (lot.status !== "sold" && lot.status !== "passed") return;
    if (advancedFor.current.has(lot.id)) return;
    advancedFor.current.add(lot.id);
    const t = setTimeout(() => {
      const id = advanceToNextLot(show.id);
      if (id) setLotKey((k) => k + 1);
    }, 2200);
    return () => clearTimeout(t);
  }, [lot?.status, lot?.id, show, advanceToNextLot, lot]);

  useEffect(() => {
    setLotKey((k) => k + 1);
  }, [show?.currentLotId]);

  if (!showId || loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--trovia-ink)]">
        <div className="h-40 w-40 animate-pulse rounded-3xl bg-white/10" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--trovia-paper)] px-6 text-center">
        <p className="font-display text-3xl">Show dipped</p>
        <p className="mt-2 text-[var(--trovia-muted)]">
          Link&apos;s cold — jump back into the live feed.
        </p>
        <Link
          href="/#live"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-[var(--trovia-acid)] px-4 text-sm font-semibold text-[var(--trovia-ink)]"
        >
          Who&apos;s live
        </Link>
      </div>
    );
  }

  function onPaid(order: Order) {
    setWinBanner({
      title: `You got it · ${order.lotTitle}`,
      shareText: shareCopyWin(show!, seller, order.lotTitle),
    });
    setTimeout(() => setWinBanner(null), 8000);
  }

  return (
    <div className="relative min-h-dvh bg-[#050a08] text-white">
      {/* Full-bleed stage */}
      <div className="absolute inset-0">
        <div key={lotKey} className="h-full w-full animate-lot-in">
          <StreamStage
            show={show}
            lot={lot}
            sellerName={seller?.displayName ?? "Host"}
            immersive
          />
        </div>
      </div>

      {/* Top chrome */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex max-w-[70%] flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="font-display text-lg tracking-tight text-white drop-shadow"
            >
              Trovia
            </Link>
            {show.status === "live" && (
              <span className="animate-pulse-live rounded bg-[var(--trovia-coral)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                Live
              </span>
            )}
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white/85 backdrop-blur">
              {formatViewers(show.viewers)} in room
            </span>
          </div>
          <div>
            <p className="truncate text-sm font-medium drop-shadow">
              {show.title}
            </p>
            <p className="truncate text-[11px] text-white/65">
              {seller?.displayName} · {seller?.city}
            </p>
            {seller && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <FollowButton sellerId={seller.id} variant="dark" size="sm" />
                <WaShareButton
                  text={
                    lot
                      ? shareCopyLot(show, seller, lot)
                      : shareCopyShow(show, seller)
                  }
                  label="WA"
                  variant="dark"
                  className="!py-1"
                />
              </div>
            )}
          </div>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <Link
            href="/#live"
            className="rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium backdrop-blur hover:bg-black/60"
          >
            Feed
          </Link>
          <div className="flex gap-1.5">
            {prevShow && (
              <button
                type="button"
                className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur"
                onClick={() => router.push(`/live/${prevShow.id}`)}
              >
                ↑ Prev
              </button>
            )}
            {nextShow && (
              <button
                type="button"
                className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur"
                onClick={() => router.push(`/live/${nextShow.id}`)}
              >
                Next live ↓
              </button>
            )}
          </div>
          <Link
            href="/seller"
            className="text-[10px] text-white/50 underline-offset-2 hover:underline"
          >
            Host desk
          </Link>
        </div>
      </header>

      {/* Bottom: chat + bids — stay in show */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-24">
        <div className="pointer-events-auto mx-auto grid max-w-3xl gap-3 px-3 pb-4 sm:px-4 lg:grid-cols-[1fr_1.15fr]">
          <LiveChat showId={show.id} variant="overlay" />
          <div className="space-y-2">
            {nextQueued && (lot?.status === "sold" || lot?.status === "passed") && (
              <p className="animate-chat-rise rounded-xl bg-black/50 px-3 py-2 text-xs text-white/80 backdrop-blur">
                Next up · {nextQueued.title} — stay, don&apos;t bounce
              </p>
            )}
            <LotPanel
              showId={show.id}
              lot={lot}
              showLive={show.status === "live"}
              variant="overlay"
              onPaid={onPaid}
              biddingPeople={biddingPeople}
            />
          </div>
        </div>
      </div>

      {winBanner && (
        <div className="animate-win-burst absolute inset-x-0 top-[16%] z-30 flex justify-center px-4">
          <div className="max-w-sm rounded-2xl border border-[var(--trovia-acid)]/40 bg-[var(--trovia-acid)] px-5 py-3 text-center font-display text-lg text-[var(--trovia-ink)] shadow-lg">
            {winBanner.title}
            <p className="mt-0.5 font-sans text-[11px] font-medium opacity-80">
              Paid on Trovia · show keeps rolling
            </p>
            <div className="pointer-events-auto mt-2 flex justify-center">
              <WaShareButton
                text={winBanner.shareText}
                label="Share win on WA"
                variant="light"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
