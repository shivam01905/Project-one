"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { useTrovia } from "@/lib/store";
import { formatInr } from "@/lib/format";

export default function OrderPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;
  const { orders, shows, getSeller, loading } = useTrovia();
  const order = orders.find((o) => o.id === orderId);
  const show = order ? shows.find((s) => s.id === order.showId) : undefined;
  const seller = show ? getSeller(show.sellerId) : undefined;

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-4 py-20">
          <div className="h-40 animate-pulse rounded-2xl bg-[var(--trovia-ink)]/8" />
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-display text-3xl">Order not found</p>
          <p className="mt-2 text-[var(--trovia-muted)]">
            Demo orders live in this session only — start a checkout from a live
            show.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-9 items-center rounded-lg bg-[var(--trovia-ink)] px-4 text-sm font-medium text-[var(--trovia-paper)]"
          >
            Discover shows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--trovia-acid-ink)]">
          Paid · UPI mock
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">You got it</h1>
        <p className="mt-2 text-[var(--trovia-muted)]">
          {order.lotTitle} from {seller?.displayName ?? "seller"}
        </p>

        <div className="mt-8 space-y-3 rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/80 p-5 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--trovia-muted)]">Item</span>
            <span>{formatInr(order.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--trovia-muted)]">Shipping</span>
            <span>{formatInr(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--trovia-ink)]/10 pt-3 font-semibold">
            <span>Total paid</span>
            <span>{formatInr(order.amount + order.shipping)}</span>
          </div>
          <p className="pt-2 text-xs text-[var(--trovia-muted)]">
            Courier · 3–7 days across India (seller-fulfilled). Tracking appears
            when the host ships.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={show ? `/live/${show.id}` : "/"}
            className="inline-flex h-9 items-center rounded-lg bg-[var(--trovia-acid)] px-4 text-sm font-medium text-[var(--trovia-ink)]"
          >
            Back to show
          </Link>
          <Link
            href="/"
            className="inline-flex h-9 items-center rounded-lg border border-[var(--trovia-ink)]/15 px-4 text-sm font-medium"
          >
            Discover more
          </Link>
        </div>
      </div>
    </div>
  );
}
