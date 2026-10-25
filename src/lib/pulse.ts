import type { BidEvent, Lot, Order, Show } from "./types";

export type SellerPulse = {
  viewers: number;
  bidsLastMin: number;
  bidsPerMin: number;
  lotGmv: number;
  soldCount: number;
  escrowHolds: number;
  activeLotTitle: string | null;
};

/** Live pulse metrics for the seller desk (demo-friendly). */
export function computeSellerPulse(
  show: Show,
  lots: Record<string, Lot>,
  bids: BidEvent[],
  orders: Order[],
  now = Date.now(),
): SellerPulse {
  const showLots = show.lotIds.map((id) => lots[id]).filter(Boolean);
  const windowMs = 60_000;
  const recent = bids.filter(
    (b) => b.showId === show.id && now - b.at < windowMs,
  );
  const sold = showLots.filter((l) => l.status === "sold");
  const lotGmv = sold.reduce((sum, l) => sum + l.currentBid, 0);
  const paidOrders = orders.filter(
    (o) => o.showId === show.id && o.status === "paid",
  );
  const escrowHolds = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const current = show.currentLotId ? lots[show.currentLotId] : null;

  return {
    viewers: show.viewers,
    bidsLastMin: recent.length,
    bidsPerMin: recent.length,
    lotGmv: Math.max(lotGmv, escrowHolds),
    soldCount: sold.length,
    escrowHolds,
    activeLotTitle: current?.title ?? null,
  };
}

export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
