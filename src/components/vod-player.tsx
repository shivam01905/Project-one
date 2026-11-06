"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lot, Show, VodHighlight } from "@/lib/types";
import { formatClock } from "@/lib/pulse";
import { formatInr } from "@/lib/format";
import { LotsTray } from "@/components/lots-tray";
import { cn } from "@/lib/utils";

export function VodPlayer({
  show,
  lots,
  sellerName,
  onSeekLot,
}: {
  show: Show;
  lots: Record<string, Lot>;
  sellerName: string;
  onSeekLot?: (lotId: string) => void;
}) {
  const duration = show.vodDurationSec ?? 12 * 60;
  const highlights = useMemo(
    () =>
      [...(show.vodHighlights ?? [])].sort((a, b) => a.atSec - b.atSec),
    [show.vodHighlights],
  );
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(highlights[0]?.atSec ?? 0);
  const [activeLotId, setActiveLotId] = useState<string | null>(
    highlights[0]?.lotId ?? show.currentLotId,
  );

  const activeHighlight: VodHighlight | null = useMemo(() => {
    let current: VodHighlight | null = null;
    for (const h of highlights) {
      if (h.atSec <= t) current = h;
    }
    return current;
  }, [highlights, t]);

  useEffect(() => {
    if (activeHighlight) setActiveLotId(activeHighlight.lotId);
  }, [activeHighlight]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setT((prev) => {
        if (prev >= duration) {
          setPlaying(false);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, duration]);

  const lot = activeLotId ? lots[activeLotId] : null;
  const progress = duration > 0 ? (t / duration) * 100 : 0;

  function jumpTo(lotId: string) {
    const mark = highlights.find((h) => h.lotId === lotId);
    const at = mark?.atSec ?? 0;
    setT(at);
    setActiveLotId(lotId);
    setPlaying(true);
    onSeekLot?.(lotId);
  }

  function seekRatio(clientX: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const next = Math.round(ratio * duration);
    setT(next);
    const nearest = [...highlights]
      .reverse()
      .find((h) => h.atSec <= next);
    if (nearest) setActiveLotId(nearest.lotId);
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#050a08] text-white">
      <div
        className="absolute inset-0 transition-[background] duration-700"
        style={{
          background: `linear-gradient(160deg, hsl(${show.coverHue} 34% 18%), #07110e 50%, hsl(${(lot?.imageHue ?? show.coverHue) + 16} 28% 12%))`,
        }}
      />
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_25%_15%,rgba(212,255,58,0.14),transparent_48%),radial-gradient(ellipse_at_80%_70%,rgba(255,90,60,0.1),transparent_42%)]" />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-20">
          <div
            key={lot?.id ?? "empty"}
            className="animate-lot-in relative h-[min(42vh,300px)] w-full max-w-xs rounded-[2rem] border border-white/10 shadow-2xl"
            style={{
              background: lot
                ? `linear-gradient(145deg, hsl(${lot.imageHue} 45% 42%), hsl(${lot.imageHue + 30} 30% 18%))`
                : "linear-gradient(145deg, #2a3a34, #121a18)",
            }}
          >
            <div className="absolute inset-3 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/15 to-transparent" />
            <div className="absolute left-4 top-4 rounded-md bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
              Replay · VOD
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-display text-lg text-white/95 drop-shadow">
                {lot?.title ?? "Rewatch the drop"}
              </p>
              <p className="mt-1 text-xs text-white/60">
                {sellerName}
                {lot?.status === "sold"
                  ? ` · sold ${formatInr(lot.currentBid)}`
                  : lot?.status === "passed"
                    ? " · passed"
                    : ""}
              </p>
            </div>
          </div>

          {activeHighlight && (
            <p className="animate-chat-rise mt-4 max-w-sm text-center text-xs text-white/70">
              Highlight · {activeHighlight.label} · {formatClock(activeHighlight.atSec)}
            </p>
          )}
        </div>

        <div className="z-20 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-5 pt-10 sm:px-4">
          <div className="mx-auto max-w-3xl space-y-3">
            <LotsTray
              show={show}
              lots={lots}
              activeLotId={activeLotId}
              onJump={jumpTo}
              variant="vod"
            />

            <div className="rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur">
              <div className="mb-2 flex items-center justify-between gap-3 text-[11px] text-white/65">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white hover:bg-white/15"
                >
                  {playing ? "Pause" : "Play"}
                </button>
                <span className="font-mono tabular-nums">
                  {formatClock(t)} / {formatClock(duration)}
                </span>
              </div>

              <div
                className="group relative h-2 cursor-pointer rounded-full bg-white/15"
                onClick={(e) => seekRatio(e.clientX, e.currentTarget)}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={t}
                aria-label="Replay progress"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") setT((x) => Math.min(duration, x + 15));
                  if (e.key === "ArrowLeft") setT((x) => Math.max(0, x - 15));
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--trovia-acid)]"
                  style={{ width: `${progress}%` }}
                />
                {highlights.map((h) => (
                  <button
                    key={h.lotId}
                    type="button"
                    title={h.label}
                    className={cn(
                      "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#050a08] transition",
                      h.lotId === activeLotId
                        ? "bg-[var(--trovia-coral)] scale-110"
                        : "bg-white/90 hover:scale-110",
                    )}
                    style={{ left: `${(h.atSec / duration) * 100}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      jumpTo(h.lotId);
                    }}
                  />
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {highlights.map((h) => (
                  <button
                    key={`chip-${h.lotId}`}
                    type="button"
                    onClick={() => jumpTo(h.lotId)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-medium transition",
                      h.lotId === activeLotId
                        ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
                        : "bg-white/10 text-white/75 hover:bg-white/15",
                    )}
                  >
                    {formatClock(h.atSec)} · {lots[h.lotId]?.title.split("·")[0]?.trim() ?? h.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
