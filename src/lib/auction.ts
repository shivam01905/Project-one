import {
  BID_STEP,
  SOFT_CLOSE_EXTEND_MS,
  SOFT_CLOSE_TRIGGER_MS,
} from "./seed";
import type { AuctionMode, Lot } from "./types";

/** Next bid amount for a quick step (default +₹100). */
export function nextBidAmount(lot: Lot, step = BID_STEP): number {
  return lot.currentBid + step;
}

/**
 * Soft-close: if a bid lands in the last SOFT_CLOSE_TRIGGER_MS, extend.
 * Sudden death: never extend.
 */
export function nextEndsAt(
  lot: Pick<Lot, "endsAt" | "auctionMode">,
  now = Date.now(),
): number | null {
  if (!lot.endsAt) return null;
  if (lot.auctionMode === "sudden") return lot.endsAt;
  const remaining = lot.endsAt - now;
  if (remaining > 0 && remaining < SOFT_CLOSE_TRIGGER_MS) {
    return now + SOFT_CLOSE_EXTEND_MS;
  }
  return lot.endsAt;
}

export function auctionModeLabel(mode: AuctionMode): string {
  return mode === "sudden" ? "Sudden death" : "Soft close";
}

export function auctionModeHint(mode: AuctionMode): string {
  return mode === "sudden"
    ? "No time extension on late bids"
    : "Bids in the last 8s add +10s";
}
