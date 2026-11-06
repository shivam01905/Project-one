"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SellerControls } from "@/components/seller-controls";
import { useTrovia, sellers } from "@/lib/store";
import { DEMO_SELLER_ID } from "@/lib/seed";
import { Button } from "@/components/ui/button";

export default function SellerPage() {
  const { shows, setRole, loading } = useTrovia();
  const seller = sellers.find((s) => s.id === DEMO_SELLER_ID);
  const myShows = shows.filter((s) => s.sellerId === DEMO_SELLER_ID);
  const primary = myShows[0] ?? shows[0];

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <div className="mb-8 animate-rise">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--trovia-muted)]">
            Seller desk · invite-only
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">
            {seller?.displayName ?? "Seller"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--trovia-muted)]">
            Demo KYC complete. Go live, pin thrift lots, start auctions — watch
            viewers, bids/min, and lot GMV on your live pulse. Buyers across
            India check out prepaid via UPI.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              className="bg-[var(--trovia-acid)] text-[var(--trovia-ink)] hover:bg-[var(--trovia-acid)]/90"
              onClick={() => setRole("seller")}
            >
              Use seller demo login
            </Button>
            <Link
              href="/"
              className="inline-flex h-8 items-center rounded-lg border border-[var(--trovia-ink)]/15 bg-background px-3 text-sm font-medium"
            >
              Back to discover
            </Link>
          </div>
        </div>

        {loading && (
          <div className="h-64 animate-pulse rounded-2xl bg-[var(--trovia-ink)]/8" />
        )}

        {!loading && !primary && (
          <div className="rounded-2xl border border-dashed border-[var(--trovia-ink)]/20 px-6 py-12 text-center">
            <p className="font-display text-xl">No shows on your desk</p>
            <p className="mt-2 text-sm text-[var(--trovia-muted)]">
              Seed data missing — refresh the app.
            </p>
          </div>
        )}

        {!loading && primary && <SellerControls show={primary} />}

        {!loading && myShows.length > 1 && (
          <div className="mt-8 space-y-6">
            {myShows.slice(1).map((s) => (
              <SellerControls key={s.id} show={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
