"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ShowCard } from "@/components/show-card";
import { LiveFeed } from "@/components/live-feed";
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
        <section className="relative overflow-hidden px-4 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[var(--trovia-acid)]/25 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-[var(--trovia-coral)]/15 blur-3xl" />

          <div className="relative mx-auto max-w-5xl animate-rise">
            <p className="font-display text-5xl leading-[0.92] tracking-tight text-[var(--trovia-ink)] sm:text-7xl md:text-8xl">
              Trovia
            </p>
            <h1 className="mt-3 max-w-xl text-lg text-[var(--trovia-ink)]/80 sm:text-xl">
              Thrift live that holds you — swipe shows, bid in-room, don&apos;t
              bounce to WhatsApp mid-drop.
            </h1>
            <p className="mt-2 max-w-lg text-sm text-[var(--trovia-muted)] sm:text-base">
              लाइव थ्रिफ्ट · स्क्रॉल करो · बिड करो · UPI — pan-India curated
              closets, courier home.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#live"
                className="inline-flex h-11 items-center rounded-full bg-[var(--trovia-ink)] px-5 text-sm font-medium text-[var(--trovia-paper)] transition hover:bg-[var(--trovia-ink)]/90"
              >
                Scroll who&apos;s live
              </a>
              <Link
                href="/seller"
                className="inline-flex h-11 items-center rounded-full border border-[var(--trovia-ink)]/20 bg-white/40 px-5 text-sm font-medium transition hover:bg-white/60"
              >
                Host a show
              </Link>
            </div>
          </div>
        </section>

        <section id="live" className="px-4 pb-10 sm:px-8">
          <div className="mx-auto max-w-lg lg:max-w-xl">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                  Live feed
                </h2>
                <p className="text-sm text-[var(--trovia-muted)]">
                  Reels energy · swipe next show · stay in Trovia
                </p>
              </div>
              {live[0] && (
                <Link
                  href={`/live/${live[0].id}`}
                  className="text-xs font-semibold text-[var(--trovia-acid-ink)] underline-offset-2 hover:underline"
                >
                  Open first →
                </Link>
              )}
            </div>
            <LiveFeed />
          </div>
        </section>

        {(upcoming.length > 0 || ended.length > 0) && (
          <section className="px-4 pb-16 sm:px-8">
            <div className="mx-auto max-w-5xl">
              {upcoming.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl tracking-tight">
                    Coming up
                  </h2>
                  <p className="mb-5 text-sm text-[var(--trovia-muted)]">
                    Set a reminder in your head — we&apos;ll keep the room warm
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
                    Just ended — catch the next
                  </h2>
                  <div className="mt-4 grid gap-4 opacity-80 sm:grid-cols-2 lg:grid-cols-3">
                    {ended.map((show) => (
                      <ShowCard key={show.id} show={show} />
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] animate-pulse rounded-2xl bg-[var(--trovia-ink)]/8"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[var(--trovia-ink)]/8 px-4 py-6 text-center text-xs text-[var(--trovia-muted)] sm:px-8">
        Trovia · stay for the show · UPI prepaid mock · courier 3–7 days
        India-wide
      </footer>
    </div>
  );
}
