"use client";

import Link from "next/link";
import { useTrovia } from "@/lib/store";
import { shareCopyShow, whatsappShareUrl } from "@/lib/share";

/** Mock push / remind strip for followed sellers who are live */
export function LiveAlerts() {
  const {
    liveAlerts,
    dismissLiveAlert,
    dismissAllLiveAlerts,
    getSeller,
    shows,
  } = useTrovia();

  if (liveAlerts.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--trovia-muted)]">
          Following · live now
        </p>
        {liveAlerts.length > 1 && (
          <button
            type="button"
            onClick={dismissAllLiveAlerts}
            className="text-[10px] text-[var(--trovia-muted)] underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      {liveAlerts.map((alert) => {
        const seller = getSeller(alert.sellerId);
        const show = shows.find((s) => s.id === alert.showId);
        if (!show || show.status !== "live") return null;
        const wa = whatsappShareUrl(shareCopyShow(show, seller));
        return (
          <div
            key={alert.id}
            className="animate-chat-rise flex flex-col gap-2 rounded-2xl border border-[var(--trovia-acid)]/35 bg-[var(--trovia-ink)] px-3 py-3 text-[var(--trovia-paper)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--trovia-acid)]">
                Seller is live · अभी लाइव
              </p>
              <p className="mt-0.5 truncate font-display text-lg leading-tight">
                {seller?.displayName ?? "Host"}
              </p>
              <p className="truncate text-xs text-white/65">
                {show.title} — don&apos;t bounce to WA empty-handed
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/live/${show.id}`}
                className="inline-flex h-9 items-center rounded-full bg-[var(--trovia-acid)] px-3 text-xs font-semibold text-[var(--trovia-ink)]"
              >
                Watch now
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-full border border-white/25 px-3 text-xs font-semibold text-white"
              >
                Ping WA
              </a>
              <button
                type="button"
                onClick={() => dismissLiveAlert(alert.id)}
                className="text-[10px] text-white/50 underline-offset-2 hover:underline"
              >
                Later
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
