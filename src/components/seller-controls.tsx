"use client";

import { useTrovia } from "@/lib/store";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Show } from "@/lib/types";
import { auctionModeLabel } from "@/lib/auction";

export function SellerControls({ show }: { show: Show }) {
  const {
    lots,
    bids,
    goLive,
    endShow,
    pinLot,
    startAuction,
    passLot,
    setAuctionMode,
    setRole,
  } = useTrovia();

  const showLots = show.lotIds.map((id) => lots[id]).filter(Boolean);
  const recentBids = bids.filter((b) => b.showId === show.id).slice(-8).reverse();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{show.title}</h1>
          <p className="text-sm text-[var(--trovia-muted)]">
            Show control · invite-only curated sellers
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {show.status !== "live" && show.status !== "ended" && (
            <Button
              className="bg-[var(--trovia-coral)] text-white hover:bg-[var(--trovia-coral)]/90"
              onClick={() => {
                setRole("seller");
                goLive(show.id);
              }}
            >
              Go live
            </Button>
          )}
          {show.status === "ended" && (
            <Button
              className="bg-[var(--trovia-coral)] text-white hover:bg-[var(--trovia-coral)]/90"
              onClick={() => {
                setRole("seller");
                goLive(show.id);
              }}
            >
              Restart live
            </Button>
          )}
          {show.status === "live" && (
            <Button
              variant="outline"
              className="border-[var(--trovia-ink)]/20"
              onClick={() => endShow(show.id)}
            >
              End show
            </Button>
          )}
          <Badge
            className={
              show.status === "live"
                ? "bg-[var(--trovia-coral)] text-white"
                : "bg-[var(--trovia-ink)]/10 text-[var(--trovia-ink)]"
            }
          >
            {show.status}
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--trovia-muted)]">
          Lots
        </p>
        <ul className="mt-3 space-y-3">
          {showLots.map((lot) => (
            <li
              key={lot.id}
              className="flex flex-col gap-2 rounded-xl bg-white/35 p-3"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium">{lot.title}</p>
                  <p className="text-xs text-[var(--trovia-muted)]">
                    {lot.status} · {formatInr(lot.currentBid)} · {lot.bidCount}{" "}
                    bids · {auctionModeLabel(lot.auctionMode)}
                  </p>
                </div>
                <div className="flex rounded-full border border-[var(--trovia-ink)]/10 bg-white/50 p-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  <button
                    type="button"
                    disabled={lot.status === "sold"}
                    onClick={() => setAuctionMode(lot.id, "soft")}
                    className={`rounded-full px-2.5 py-1 transition ${
                      lot.auctionMode === "soft"
                        ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
                        : "text-[var(--trovia-muted)]"
                    }`}
                  >
                    Soft close
                  </button>
                  <button
                    type="button"
                    disabled={lot.status === "sold"}
                    onClick={() => setAuctionMode(lot.id, "sudden")}
                    className={`rounded-full px-2.5 py-1 transition ${
                      lot.auctionMode === "sudden"
                        ? "bg-[var(--trovia-coral)] text-white"
                        : "text-[var(--trovia-muted)]"
                    }`}
                  >
                    Sudden 💀
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[var(--trovia-ink)]/15"
                  onClick={() => pinLot(show.id, lot.id)}
                  disabled={lot.status === "sold"}
                >
                  Pin
                </Button>
                <Button
                  size="sm"
                  className="bg-[var(--trovia-acid)] text-[var(--trovia-ink)] hover:bg-[var(--trovia-acid)]/90"
                  onClick={() =>
                    startAuction(show.id, lot.id, lot.auctionMode)
                  }
                  disabled={lot.status === "sold" || show.status !== "live"}
                >
                  Start auction
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => passLot(show.id, lot.id)}
                  disabled={lot.status === "sold"}
                >
                  Pass
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-[var(--trovia-muted)]">
          Soft close extends +10s on bids in the last 8s. Sudden death never
          extends — clock dies when it dies.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--trovia-muted)]">
          Recent bids
        </p>
        {recentBids.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--trovia-muted)]">
            No bids yet — start an auction and invite the room.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {recentBids.map((b) => (
              <li key={b.id} className="flex justify-between gap-3">
                <span>
                  {b.user}{" "}
                  <span className="text-[var(--trovia-muted)]">on lot</span>
                </span>
                <span className="font-medium">{formatInr(b.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-[var(--trovia-muted)]">
        KYC verified for demo · stream is a visual placeholder. Open the{" "}
        <a className="underline underline-offset-2" href={`/live/${show.id}`}>
          live room
        </a>{" "}
        as Buyer to swipe-bid.
      </p>
    </div>
  );
}
