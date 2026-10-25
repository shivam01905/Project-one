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
import { cn } from "@/lib/utils";

export function LotPanel({
  showId,
  lot,
  showLive,
  variant = "panel",
  onPaid,
  biddingPeople,
}: {
  showId: string;
  lot: Lot | null;
  showLive: boolean;
  variant?: "panel" | "overlay";
  onPaid?: (order: Order) => void;
  biddingPeople?: number;
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
  const [showMax, setShowMax] = useState(false);
  const handledWins = useRef<Set<string>>(new Set());
  const prevEndsAt = useRef<number | null>(null);
  const overlay = variant === "overlay";

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
      <div
        className={cn(
          "rounded-2xl border border-dashed p-4",
          overlay
            ? "border-white/20 bg-black/35 text-white backdrop-blur"
            : "border-[var(--trovia-ink)]/15 bg-[var(--trovia-panel)]/60",
        )}
      >
        <p className="font-display text-lg">Next piece loading…</p>
        <p className={cn("mt-1 text-sm", overlay ? "text-white/60" : "text-[var(--trovia-muted)]")}>
          Stay — host is pulling the next thrift find.
        </p>
      </div>
    );
  }

  const canBid = showLive && lot.status === "live" && role === "buyer";
  const primaryAmount = nextBidAmount(lot, BID_STEP);
  const ceiling = maxBids[lot.id];
  const sudden = lot.auctionMode === "sudden";
  const urgent =
    secondsLeft != null && secondsLeft <= 8 && lot.status === "live";

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
        className={cn(
          "rounded-2xl p-3 sm:p-4",
          flash && "animate-bid-flash",
          overlay
            ? "border border-white/10 bg-black/45 text-white backdrop-blur-md"
            : "border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/90 backdrop-blur",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.18em]",
                overlay ? "text-white/55" : "text-[var(--trovia-muted)]",
              )}
            >
              On camera
            </p>
            <h2 className="mt-0.5 truncate font-display text-lg leading-tight tracking-tight sm:text-xl">
              {lot.title}
            </h2>
            <p
              className={cn(
                "mt-0.5 truncate text-xs",
                overlay ? "text-white/55" : "text-[var(--trovia-muted)]",
              )}
            >
              {lot.condition} · {lot.size}
              {typeof biddingPeople === "number" && biddingPeople > 0 && (
                <> · {biddingPeople} bidding</>
              )}
            </p>
          </div>
          {secondsLeft !== null && lot.status === "live" && (
            <div
              className={cn(
                "min-w-[3.25rem] rounded-xl px-2.5 py-1.5 text-center",
                sudden
                  ? "bg-[var(--trovia-coral)] text-white"
                  : overlay
                    ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
                    : "bg-[var(--trovia-ink)] text-[var(--trovia-acid)]",
                urgent && "animate-urgency",
                extendedPulse && "ring-2 ring-[var(--trovia-acid)]",
              )}
            >
              <div className="text-[9px] uppercase tracking-wider opacity-80">
                {sudden ? "💀" : "Ends"}
              </div>
              <div className="font-display text-xl tabular-nums leading-none">
                {secondsLeft}s
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider",
              sudden
                ? "bg-[var(--trovia-coral)]/25 text-[var(--trovia-coral)]"
                : overlay
                  ? "bg-[var(--trovia-acid)]/25 text-[var(--trovia-acid)]"
                  : "bg-[var(--trovia-acid)]/25 text-[var(--trovia-acid-ink)]",
            )}
          >
            {auctionModeLabel(lot.auctionMode)}
          </span>
          {!overlay && (
            <span className="text-[var(--trovia-muted)]">
              {auctionModeHint(lot.auctionMode)}
            </span>
          )}
          {extendedPulse && (
            <span className="font-semibold text-[var(--trovia-acid)]">
              Soft close · +10s
            </span>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p
              className={cn(
                "text-[11px]",
                overlay ? "text-white/55" : "text-[var(--trovia-muted)]",
              )}
            >
              Current · {lot.bidCount} bids
              {ceiling != null ? ` · max ${formatInr(ceiling)}` : ""}
            </p>
            <p className="font-display text-2xl tracking-tight tabular-nums sm:text-3xl">
              {formatInr(lot.currentBid)}
            </p>
          </div>
          <button
            type="button"
            disabled={!canBid}
            onClick={() => {
              const order = createBinOrder(showId, lot.id);
              if (order) {
                setCheckoutOrder(order);
                setOpen(true);
              }
            }}
            className={cn(
              "text-right text-xs disabled:opacity-40",
              overlay ? "text-white/70" : "text-[var(--trovia-muted)]",
            )}
          >
            <div>BIN</div>
            <div
              className={cn(
                "text-sm font-semibold",
                overlay ? "text-white" : "text-[var(--trovia-ink)]",
              )}
            >
              {formatInr(lot.buyNowPrice)}
            </div>
          </button>
        </div>

        {lot.status === "sold" && (
          <p
            className={cn(
              "mt-2 rounded-lg px-3 py-2 text-sm font-medium",
              overlay ? "bg-[var(--trovia-acid)]/25" : "bg-[var(--trovia-acid)]/25",
            )}
          >
            Sold{lot.highBidder ? ` → ${lot.highBidder}` : ""} ·{" "}
            {formatInr(lot.currentBid)}
          </p>
        )}
        {lot.status === "passed" && (
          <p
            className={cn(
              "mt-2 rounded-lg px-3 py-2 text-sm",
              overlay ? "bg-white/10 text-white/70" : "bg-[var(--trovia-ink)]/5 text-[var(--trovia-muted)]",
            )}
          >
            Passed — next lot rolling…
          </p>
        )}

        {canBid && (
          <div className="mt-3 space-y-2.5">
            <SwipeToBid
              amount={primaryAmount}
              onBid={() => flashBid(primaryAmount)}
              label="Swipe to bid"
            />
            <div className="flex flex-wrap gap-1.5">
              {QUICK_BID_STEPS.map((step) => {
                const amt = nextBidAmount(lot, step);
                return (
                  <button
                    key={step}
                    type="button"
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums",
                      overlay
                        ? "border border-white/20 bg-white/10 text-white"
                        : "border border-[var(--trovia-ink)]/15 bg-white/40",
                    )}
                    onClick={() => flashBid(amt)}
                  >
                    +₹{step}
                  </button>
                );
              })}
              <button
                type="button"
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  overlay
                    ? "border border-white/20 bg-white/10 text-white"
                    : "border border-[var(--trovia-ink)]/15 bg-white/40",
                )}
                onClick={() => setShowMax((v) => !v)}
              >
                Max
              </button>
            </div>
            {showMax && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={primaryAmount}
                  inputMode="numeric"
                  placeholder={`Max ≥ ${primaryAmount}`}
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                  className={cn(
                    "h-9 text-sm",
                    overlay
                      ? "border-white/20 bg-black/40 text-white"
                      : "border-[var(--trovia-ink)]/10 bg-white/40",
                  )}
                />
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-[var(--trovia-acid)] px-3 text-xs font-semibold text-[var(--trovia-ink)]"
                  onClick={() => {
                    const n = Number(maxInput);
                    if (!Number.isFinite(n) || n <= lot.currentBid) return;
                    setMaxBid(lot.id, Math.floor(n));
                  }}
                >
                  Set
                </button>
              </div>
            )}
          </div>
        )}

        {role === "seller" && (
          <p
            className={cn(
              "mt-2 text-xs",
              overlay ? "text-white/55" : "text-[var(--trovia-muted)]",
            )}
          >
            Seller mode — switch to Buyer to swipe-bid.
          </p>
        )}
      </div>

      <CheckoutSheet
        order={checkoutOrder}
        open={open}
        onOpenChange={setOpen}
        onPaid={onPaid}
      />
    </>
  );
}
