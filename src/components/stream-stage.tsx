"use client";

import { useEffect, useState } from "react";
import type { Lot, Seller, Show } from "@/lib/types";
import { cn } from "@/lib/utils";

const FRAMES = [
  "Holding the piece to camera…",
  "Checking seams & fade…",
  "Tag + size callout…",
  "Spin for the chat…",
];

const AUDIO_FRAMES = [
  "Host on mic · describing fade…",
  "Co-host calling size…",
  "Condition talk · seams…",
  "Lot still · listen + bid…",
];

export function StreamStage({
  show,
  lot,
  sellerName,
  coHostName,
  immersive = false,
  lowBandwidth = false,
  speakingSeller,
}: {
  show: Show;
  lot: Lot | null;
  sellerName: string;
  coHostName?: string | null;
  immersive?: boolean;
  /** Audio + lot stills for weak / 3G networks */
  lowBandwidth?: boolean;
  speakingSeller?: Seller | null;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 3200);
    return () => clearInterval(id);
  }, []);

  const live = show.status === "live";
  const collab = Boolean(show.coHostIds?.length);
  const frames = lowBandwidth ? AUDIO_FRAMES : FRAMES;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        immersive
          ? "min-h-dvh rounded-none"
          : "min-h-[420px] rounded-[1.25rem] sm:min-h-[560px]",
      )}
      style={{
        background: lowBandwidth
          ? `linear-gradient(165deg, #0a1210 0%, hsl(${show.coverHue} 22% 14%) 45%, #050807)`
          : `linear-gradient(160deg, hsl(${show.coverHue} 38% 22%), #07110e 48%, hsl(${(lot?.imageHue ?? show.coverHue) + 20} 30% 14%))`,
      }}
    >
      {!lowBandwidth && (
        <div className="absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_20%,rgba(212,255,58,0.18),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(255,107,74,0.12),transparent_45%)]" />
      )}
      <div className="animate-grain pointer-events-none absolute inset-0 opacity-[0.12]" />

      {lowBandwidth ? (
        /* —— 3G / weak network: audio bars + dominant lot still —— */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pb-[30vh] pt-20">
          <div
            className="relative aspect-[3/4] w-[min(58vw,260px)] overflow-hidden rounded-2xl border border-white/15 shadow-2xl"
            style={{
              background: lot
                ? `linear-gradient(145deg, hsl(${lot.imageHue} 42% 38%), hsl(${lot.imageHue + 25} 28% 16%))`
                : "linear-gradient(145deg, #2a3a34, #121a18)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            <div className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[var(--trovia-acid)]">
              Lot still · low data
            </div>
            <div className="absolute inset-x-3 bottom-3">
              <p className="font-display text-base text-white drop-shadow">
                {lot?.title ?? "Waiting for next lot"}
              </p>
              <p className="mt-0.5 text-[11px] text-white/65">
                {lot?.subtitle ?? "Host pulling next piece"}
              </p>
            </div>
          </div>

          <div className="flex w-[min(70vw,280px)] flex-col items-center gap-2">
            <div className="flex h-10 w-full items-end justify-center gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className="animate-vu w-1.5 rounded-full bg-[var(--trovia-acid)]/85"
                  style={{
                    height: `${28 + ((i * 41) % 55)}%`,
                    animationDelay: `${(i % 8) * 0.07}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-[11px] text-white/70">
              {speakingSeller?.displayName ?? sellerName}
              {coHostName ? ` · + ${coHostName.split("·")[0].trim()}` : ""} —{" "}
              {frames[frame]}
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pb-[28vh] pt-16">
          {collab ? (
            <div className="flex w-full max-w-md items-end justify-center gap-3 px-4 sm:gap-4">
              <div
                className="animate-float relative h-[min(40vh,280px)] w-[38%] rounded-[1.6rem] border border-white/10 shadow-2xl"
                style={{
                  background: `linear-gradient(145deg, hsl(${show.coverHue} 40% 40%), hsl(${show.coverHue + 20} 28% 16%))`,
                }}
              >
                <div className="absolute inset-2.5 rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-white/15 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
                    Host
                  </p>
                  <p className="truncate font-display text-sm text-white/95">
                    {sellerName.split("·")[0].trim()}
                  </p>
                </div>
              </div>
              <div
                className="animate-float relative h-[min(48vh,340px)] w-[48%] rounded-[2rem] border border-white/10 shadow-2xl"
                style={{
                  background: lot
                    ? `linear-gradient(145deg, hsl(${lot.imageHue} 45% 42%), hsl(${lot.imageHue + 30} 30% 18%))`
                    : "linear-gradient(145deg, #2a3a34, #121a18)",
                  animationDelay: "0.35s",
                }}
              >
                <div className="absolute inset-3 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/15 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-display text-lg text-white/95 drop-shadow">
                    {lot?.title ?? "Waiting for next lot"}
                  </p>
                  <p className="mt-1 text-xs text-white/60">{frames[frame]}</p>
                </div>
              </div>
              <div
                className="animate-float relative h-[min(40vh,280px)] w-[38%] rounded-[1.6rem] border border-white/10 shadow-2xl"
                style={{
                  background: `linear-gradient(145deg, hsl(${(show.coverHue + 140) % 360} 42% 38%), hsl(${(show.coverHue + 160) % 360} 30% 15%))`,
                  animationDelay: "0.2s",
                }}
              >
                <div className="absolute inset-2.5 rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-white/15 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
                    Co-host
                  </p>
                  <p className="truncate font-display text-sm text-white/95">
                    {(coHostName ?? "Guest").split("·")[0].trim()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="animate-float relative h-[min(48vh,340px)] w-[42%] max-w-xs rounded-[2rem] border border-white/10 shadow-2xl"
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
                <p className="mt-1 text-xs text-white/60">{frames[frame]}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!immersive && (
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {live ? (
              <span className="animate-pulse-live inline-flex items-center gap-1.5 rounded-md bg-[var(--trovia-coral)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Live
              </span>
            ) : (
              <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {show.status}
              </span>
            )}
            <span className="rounded-md bg-black/40 px-2 py-1 text-[10px] text-white/80 backdrop-blur">
              {lowBandwidth ? "Audio + stills · 3G" : "Demo stream · not WebRTC"}
            </span>
          </div>
          <div className="rounded-md bg-black/40 px-2 py-1 text-right text-[10px] text-white/80 backdrop-blur">
            <div className="font-medium text-white">{sellerName}</div>
            <div>{collab ? "Collab · thrift" : "Show · thrift"}</div>
          </div>
        </div>
      )}

      {!lowBandwidth && (
        <div
          className={cn(
            "absolute left-4 right-4 flex items-end gap-1 opacity-50",
            immersive ? "bottom-[42vh]" : "bottom-4",
          )}
        >
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
      )}
    </div>
  );
}
