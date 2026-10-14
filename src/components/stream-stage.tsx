"use client";

import { useEffect, useState } from "react";
import type { Lot, Show } from "@/lib/types";

const FRAMES = [
  "Holding the piece to camera…",
  "Checking seams & fade…",
  "Tag + size callout…",
  "Spin for the chat…",
];

export function StreamStage({
  show,
  lot,
  sellerName,
}: {
  show: Show;
  lot: Lot | null;
  sellerName: string;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 3200);
    return () => clearInterval(id);
  }, []);

  const live = show.status === "live";

  return (
    <div
      className="relative h-full min-h-[420px] w-full overflow-hidden rounded-[1.25rem] sm:min-h-[560px]"
      style={{
        background: `linear-gradient(160deg, hsl(${show.coverHue} 38% 22%), #07110e 48%, hsl(${(lot?.imageHue ?? show.coverHue) + 20} 30% 14%))`,
      }}
    >
      {/* Atmospheric layers */}
      <div className="absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_20%,rgba(212,255,58,0.18),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(255,107,74,0.12),transparent_45%)]" />
      <div className="animate-grain pointer-events-none absolute inset-0 opacity-[0.12]" />

      {/* Mock product silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="animate-float relative h-[55%] w-[42%] max-w-xs rounded-[2rem] border border-white/10 shadow-2xl"
          style={{
            background: lot
              ? `linear-gradient(145deg, hsl(${lot.imageHue} 45% 42%), hsl(${lot.imageHue + 30} 30% 18%))`
              : "linear-gradient(145deg, #2a3a34, #121a18)",
          }}
        >
          <div className="absolute inset-3 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/15 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-display text-lg text-white/95 drop-shadow">
              {lot?.title ?? "Waiting for next lot"}
            </p>
            <p className="mt-1 text-xs text-white/60">{FRAMES[frame]}</p>
          </div>
        </div>
      </div>

      {/* Top chrome */}
      <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {live ? (
            <span className="animate-pulse-live inline-flex items-center gap-1.5 rounded-md bg-[var(--trovia-coral)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Live
            </span>
          ) : show.status === "scheduled" ? (
            <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
              Starting soon
            </span>
          ) : (
            <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Replay / ended
            </span>
          )}
          <span className="rounded-md bg-black/40 px-2 py-1 text-[10px] text-white/80 backdrop-blur">
            Demo stream · not WebRTC
          </span>
        </div>
        <div className="rounded-md bg-black/40 px-2 py-1 text-right text-[10px] text-white/80 backdrop-blur">
          <div className="font-medium text-white">{sellerName}</div>
          <div>Show · thrift</div>
        </div>
      </div>

      {/* Fake VU / energy bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-1 opacity-70">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="animate-vu w-1 flex-1 rounded-full bg-[var(--trovia-acid)]/80"
            style={{
              height: `${18 + ((i * 37) % 40)}%`,
              animationDelay: `${(i % 8) * 0.08}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
