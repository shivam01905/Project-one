"use client";

import { useEffect, useRef, useState } from "react";
import type { Lot, Order } from "@/lib/types";
import { useTrovia } from "@/lib/store";
import { formatInr } from "@/lib/format";
import { CheckoutSheet } from "@/components/checkout-sheet";
import { DEMO_BUYER } from "@/lib/seed";

export function LotPanel({
  showId,
  lot,
  showLive,
}: {
  showId: string;
  lot: Lot | null;
  showLive: boolean;
}) {
  const { placeBid, createBinOrder, createWinOrder, role } = useTrovia();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const handledWins = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!lot?.endsAt) {
      setSecondsLeft(null);
      return;
    }
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.ceil((lot.endsAt! - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [lot?.endsAt, lot?.id]);

  useEffect(() => {
    if (
      lot?.status === "sold" &&
      lot.highBidder === DEMO_BUYER.name &&
      !handledWins.current.has(lot.id)
    ) {
      handledWins.current.add(lot.id);
      const order = createWinOrder(showId, lot.id);
      if (order) {
        setCheckoutOrder(order);
        setOpen(true);
      }
    }
  }, [lot?.status, lot?.highBidder, lot?.id, showId, createWinOrder, lot]);

  if (!lot) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--trovia-ink)]/15 bg-[var(--trovia-panel)]/60 p-5">
        <p className="font-display text-xl">No lot pinned</p>
        <p className="mt-1 text-sm text-[var(--trovia-muted)]">
          Host will bring the next thrift piece up soon.
        </p>
      </div>
    );
  }

  const canBid = showLive && lot.status === "live" && role === "buyer";

  return (
    <>
      <div
        className={`rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/90 p-4 backdrop-blur sm:p-5 ${flash ? "animate-bid-flash" : ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--trovia-muted)]">
              Current item
            </p>
            <h2 className="mt-1 font-display text-xl leading-tight tracking-tight sm:text-2xl">
              {lot.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--trovia-muted)]">
              {lot.subtitle} · {lot.condition} · Size {lot.size}
            </p>
          </div>
          {secondsLeft !== null && lot.status === "live" && (
            <div className="min-w-[3.5rem] rounded-xl bg-[var(--trovia-ink)] px-3 py-2 text-center text-[var(--trovia-acid)]">
              <div className="text-[10px] uppercase tracking-wider opacity-70">
                Ends
              </div>
              <div className="font-display text-2xl tabular-nums leading-none">
                {secondsLeft}s
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--trovia-muted)]">Current bid</p>
            <p className="font-display text-3xl tracking-tight">
              {formatInr(lot.currentBid)}
            </p>
            <p className="text-xs text-[var(--trovia-muted)]">
              {lot.bidCount} bids
              {lot.highBidder ? ` · ${lot.highBidder}` : ""}
            </p>
          </div>
          <div className="text-right text-xs text-[var(--trovia-muted)]">
            <div>Buy It Now</div>
            <div className="text-sm font-medium text-[var(--trovia-ink)]">
              {formatInr(lot.buyNowPrice)}
            </div>
          </div>
        </div>

        {lot.status === "sold" && (
          <p className="mt-3 rounded-lg bg-[var(--trovia-acid)]/25 px-3 py-2 text-sm font-medium">
            Sold
            {lot.highBidder ? ` to ${lot.highBidder}` : ""} ·{" "}
            {formatInr(lot.currentBid)}
          </p>
        )}
        {lot.status === "passed" && (
          <p className="mt-3 rounded-lg bg-[var(--trovia-ink)]/5 px-3 py-2 text-sm text-[var(--trovia-muted)]">
            Lot passed — waiting for next.
          </p>
        )}

        {canBid && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="h-12 rounded-lg bg-[var(--trovia-acid)] text-base font-semibold text-[var(--trovia-ink)] transition hover:bg-[var(--trovia-acid)]/90"
              onClick={() => {
                placeBid(showId, lot.id);
                setFlash(true);
                setTimeout(() => setFlash(false), 400);
              }}
            >
              Bid +₹100
            </button>
            <button
              type="button"
              className="h-12 rounded-lg border border-[var(--trovia-ink)]/20 bg-white/30 text-base font-semibold transition hover:bg-white/50"
              onClick={() => {
                const order = createBinOrder(showId, lot.id);
                if (order) {
                  setCheckoutOrder(order);
                  setOpen(true);
                }
              }}
            >
              Buy Now
            </button>
          </div>
        )}

        {!showLive && (
          <p className="mt-3 text-sm text-[var(--trovia-muted)]">
            Show isn&apos;t live — bidding opens when the host goes live.
          </p>
        )}
        {role === "seller" && (
          <p className="mt-3 text-sm text-[var(--trovia-muted)]">
            You&apos;re in seller mode — switch to Buyer to place bids.
          </p>
        )}
      </div>

      <CheckoutSheet
        order={checkoutOrder}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
