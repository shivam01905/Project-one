"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { StreamStage } from "@/components/stream-stage";
import { LiveChat } from "@/components/live-chat";
import { LotPanel } from "@/components/lot-panel";
import { useTrovia } from "@/lib/store";

export default function LiveRoomPage() {
  const params = useParams<{ showId: string }>();
  const showId = params?.showId;
  const { shows, lots, getSeller, loading } = useTrovia();
  const show = shows.find((s) => s.id === showId);
  const seller = show ? getSeller(show.sellerId) : undefined;
  const lot = show?.currentLotId ? lots[show.currentLotId] : null;

  if (!showId || loading) {
    return (
      <div className="min-h-screen pb-10">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
          <div className="h-[420px] animate-pulse rounded-[1.25rem] bg-[var(--trovia-ink)]/10" />
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-display text-3xl">Show not found</p>
          <p className="mt-2 text-[var(--trovia-muted)]">
            This thrift room doesn&apos;t exist or the link is stale.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-9 items-center rounded-lg bg-[var(--trovia-ink)] px-4 text-sm font-medium text-[var(--trovia-paper)]"
          >
            Back to discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
                {show.title}
              </h1>
              <p className="text-sm text-[var(--trovia-muted)]">
                {show.titleHi} · {seller?.displayName} · {seller?.city}
              </p>
            </div>
            <Link
              href="/seller"
              className="text-xs text-[var(--trovia-muted)] underline-offset-2 hover:underline"
            >
              Seller controls
            </Link>
          </div>
          <StreamStage
            show={show}
            lot={lot}
            sellerName={seller?.displayName ?? "Host"}
          />
        </div>

        <div className="flex flex-col gap-4">
          <LotPanel
            showId={show.id}
            lot={lot}
            showLive={show.status === "live"}
          />
          <div className="min-h-[280px] flex-1">
            <LiveChat showId={show.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
