"use client";

import { useEffect, useRef, useState } from "react";
import type { Lot, Order } from "@/lib/types";
import { useTrovia } from "@/lib/store";
import { formatInr } from "@/lib/format";
import { BID_STEP, QUICK_BID_STEPS } from "@/lib/seed";
import { auctionModeHint, auctionModeLabel, nextBidAmount } from "@/lib/auction";
import { CheckoutSheet } from "@/components/checkout-sheet";
import { SwipeToBid } from "@/components/swipe-to-bid";
import { Input } from "@/components/ui/input";
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
  const {
    placeBid,
    createBinOrder,
    createWinOrder,
    role,
    maxBids,
    setMaxBid,
  } = useTrovia();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [extendedPulse, setExtendedPulse] = useState(false);
  const [maxInput, setMaxInput] = useState("");
  const handledWins = useRef<Set<string>>(new Set());
  const prevEndsAt = useRef<number | null>(null);

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

  // Soft-close visual: endsAt jumped forward
  useEffect(() => {
    if (
      lot?.endsAt &&
      prevEndsAt.current &&
      lot.endsAt > prevEndsAt.current + 500
    ) {
      setExtendedPulse(true);
      const t = setTimeout(() => setExtendedPulse(false), 900);
      prevEndsAt.current = lot.endsAt;
      return () => clearTimeout(t);
    }
    prevEndsAt.current = lot?.endsAt ?? null;
  }, [lot?.endsAt]);

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

  useEffect(() => {
    if (!lot) return;
    const existing = maxBids[lot.id];
    setMaxInput(existing != null ? String(existing) : "");
  }, [lot?.id, maxBids, lot]);

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
  const primaryAmount = nextBidAmount(lot, BID_STEP);
  const ceiling = maxBids[lot.id];
  const sudden = lot.auctionMode === "sudden";

  function flashBid(amount?: number) {
    const ok = placeBid(showId, lot!.id, amount);
    if (ok) {
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
    }
    return ok;
  }

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
            <div
              className={`min-w-[3.5rem] rounded-xl px-3 py-2 text-center ${
                sudden
                  ? "bg-[var(--trovia-coral)] text-white"
                  : "bg-[var(--trovia-ink)] text-[var(--trovia-acid)]"
              } ${extendedPulse ? "animate-bid-flash ring-2 ring-[var(--trovia-acid)]" : ""}`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-80">
                {sudden ? "💀 Ends" : "Ends"}
              </div>
              <div className="font-display text-2xl tabular-nums leading-none">
                {secondsLeft}s
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span
            className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider ${
              sudden
                ? "bg-[var(--trovia-coral)]/15 text-[var(--trovia-coral)]"
                : "bg-[var(--trovia-acid)]/25 text-[var(--trovia-acid-ink)]"
            }`}
          >
            {auctionModeLabel(lot.auctionMode)}
          </span>
          <span className="text-[var(--trovia-muted)]">
            {auctionModeHint(lot.auctionMode)}
          </span>
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
              {ceiling != null ? ` · your max ${formatInr(ceiling)}` : ""}
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
          <div className="mt-4 space-y-3">
            <SwipeToBid
              amount={primaryAmount}
              onBid={() => flashBid(primaryAmount)}
              label="Swipe to bid"
            />

            <div className="flex flex-wrap gap-2">
              {QUICK_BID_STEPS.map((step) => {
                const amt = nextBidAmount(lot, step);
                return (
                  <button
                    key={step}
                    type="button"
                    className="rounded-full border border-[var(--trovia-ink)]/15 bg-white/40 px-3 py-1.5 text-xs font-semibold tabular-nums transition hover:bg-white/70"
                    onClick={() => flashBid(amt)}
                  >
                    +₹{step}
                  </button>
                );
              })}
              <button
                type="button"
                className="rounded-full border border-[var(--trovia-ink)]/15 bg-white/40 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/70"
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

            <div className="flex gap-2">
              <Input
                type="number"
                min={primaryAmount}
                inputMode="numeric"
                placeholder={`Max bid ≥ ${primaryAmount}`}
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="h-9 border-[var(--trovia-ink)]/10 bg-white/40 text-sm"
              />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-[var(--trovia-ink)] px-3 text-xs font-semibold text-[var(--trovia-paper)]"
                onClick={() => {
                  const n = Number(maxInput);
                  if (!Number.isFinite(n) || n <= lot.currentBid) return;
                  setMaxBid(lot.id, Math.floor(n));
                }}
              >
                Set max
              </button>
              {ceiling != null && (
                <button
                  type="button"
                  className="shrink-0 rounded-lg px-2 text-xs text-[var(--trovia-muted)] underline-offset-2 hover:underline"
                  onClick={() => setMaxBid(lot.id, null)}
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[11px] text-[var(--trovia-muted)]">
              Max bid caps your raises — swipe / quick bids won&apos;t exceed it.
              Clear charge on win via UPI.
            </p>
          </div>
        )}

        {!showLive && (
          <p className="mt-3 text-sm text-[var(--trovia-muted)]">
            Show isn&apos;t live — bidding opens when the host goes live.
          </p>
        )}
        {role === "seller" && (
          <p className="mt-3 text-sm text-[var(--trovia-muted)]">
            You&apos;re in seller mode — switch to Buyer to swipe-bid.
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
