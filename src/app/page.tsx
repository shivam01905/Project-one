"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ShowCard } from "@/components/show-card";
import { useTrovia } from "@/lib/store";
export default function HomePage() {
  const { shows, loading } = useTrovia();
  const live = shows.filter((s) => s.status === "live");
  const upcoming = shows.filter((s) => s.status === "scheduled");
  const ended = shows.filter((s) => s.status === "ended");

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />

      <main className="relative flex-1">
        {/* Hero — brand first, one composition */}
        <section className="relative overflow-hidden px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10">
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[var(--trovia-acid)]/25 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-[var(--trovia-coral)]/15 blur-3xl" />

          <div className="relative mx-auto max-w-5xl animate-rise">
            <p className="font-display text-5xl leading-[0.92] tracking-tight text-[var(--trovia-ink)] sm:text-7xl md:text-8xl">
              Trovia
            </p>
            <h1 className="mt-4 max-w-xl text-lg text-[var(--trovia-ink)]/80 sm:text-xl">
              Thrift live shopping for India — watch the closet, bid the piece,
              pay with UPI.
            </h1>
            <p className="mt-2 max-w-lg text-sm text-[var(--trovia-muted)] sm:text-base">
              लाइव थ्रिफ्ट शो · बिड · UPI — curated sellers, pan-India shipping
              via courier.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={live[0] ? `/live/${live[0].id}` : "#live"}
                className="inline-flex h-11 items-center rounded-lg bg-[var(--trovia-ink)] px-5 text-sm font-medium text-[var(--trovia-paper)] transition hover:bg-[var(--trovia-ink)]/90"
              >
                Watch who&apos;s live
              </Link>
              <Link
                href="/seller"
                className="inline-flex h-11 items-center rounded-lg border border-[var(--trovia-ink)]/20 bg-white/40 px-5 text-sm font-medium transition hover:bg-white/60"
              >
                Seller go-live
              </Link>
            </div>
          </div>
        </section>

        <section id="live" className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                  Live now
                </h2>
                <p className="text-sm text-[var(--trovia-muted)]">
                  Collector thrift drops · hosts across India
                </p>
              </div>
            </div>

            {loading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-2xl bg-[var(--trovia-ink)]/8"
                  />
                ))}
              </div>
            )}

            {!loading && live.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[var(--trovia-ink)]/20 bg-white/30 px-6 py-12 text-center">
                <p className="font-display text-xl">No live shows right now</p>
                <p className="mt-2 text-sm text-[var(--trovia-muted)]">
                  Check upcoming drops, or open the seller panel to go live.
                </p>
                <Link
                  href="/seller"
                  className="mt-5 inline-flex h-9 items-center rounded-lg bg-[var(--trovia-acid)] px-4 text-sm font-medium text-[var(--trovia-ink)]"
                >
                  Go live as seller
                </Link>
              </div>
            )}

            {!loading && live.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {live.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            )}

            {upcoming.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl tracking-tight">Upcoming</h2>
                <p className="mb-5 text-sm text-[var(--trovia-muted)]">
                  Scheduled thrift hours
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}

            {ended.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-xl tracking-tight text-[var(--trovia-muted)]">
                  Recently ended
                </h2>
                <div className="mt-4 grid gap-4 opacity-80 sm:grid-cols-2 lg:grid-cols-3">
                  {ended.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--trovia-ink)]/8 px-4 py-6 text-center text-xs text-[var(--trovia-muted)] sm:px-8">
        Trovia demo · UPI prepaid mock · courier 3–7 days India-wide · not a
        full marketplace catalog
      </footer>
    </div>
  );
}
