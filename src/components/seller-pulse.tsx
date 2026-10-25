"use client";

import { useEffect, useState } from "react";
import type { Show } from "@/lib/types";
import { useTrovia } from "@/lib/store";
import { computeSellerPulse } from "@/lib/pulse";
import { formatInr, formatViewers } from "@/lib/format";

export function SellerPulse({ show }: { show: Show }) {
  const { lots, bids, orders } = useTrovia();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(id);
  }, []);

  const pulse = computeSellerPulse(show, lots, bids, orders, now);
  const live = show.status === "live";

  return (
    <div className="rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/80 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--trovia-muted)]">
          Live pulse
        </p>
        {live ? (
          <span className="animate-pulse-live rounded bg-[var(--trovia-coral)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Live
          </span>
        ) : (
          <span className="rounded bg-[var(--trovia-ink)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--trovia-muted)]">
            {show.status}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric
          label="Viewers"
          value={formatViewers(pulse.viewers)}
          hint="in room"
        />
        <Metric
          label="Bids / min"
          value={String(pulse.bidsPerMin)}
          hint="last 60s"
          accent={pulse.bidsPerMin > 0}
        />
        <Metric
          label="Lot GMV"
          value={formatInr(pulse.lotGmv)}
          hint={`${pulse.soldCount} sold`}
        />
        <Metric
          label="Escrow holds"
          value={formatInr(pulse.escrowHolds)}
          hint="prepaid mock"
        />
      </div>

      {pulse.activeLotTitle && live && (
        <p className="mt-3 truncate text-xs text-[var(--trovia-muted)]">
          Active ·{" "}
          <span className="font-medium text-[var(--trovia-ink)]">
            {pulse.activeLotTitle}
          </span>
        </p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/40 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--trovia-muted)]">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-xl tracking-tight tabular-nums ${
          accent ? "text-[var(--trovia-coral)]" : "text-[var(--trovia-ink)]"
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] text-[var(--trovia-muted)]">{hint}</p>
    </div>
  );
}
