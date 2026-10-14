"use client";

import { useCallback, useRef, useState } from "react";
import { formatInr } from "@/lib/format";
import { cn } from "@/lib/utils";

const THRESHOLD = 0.55;

export function SwipeToBid({
  amount,
  disabled,
  onBid,
  label = "Swipe to bid",
}: {
  amount: number;
  disabled?: boolean;
  onBid: () => void;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const maxX = useRef(0);
  const armed = useRef(false);

  const reset = useCallback(() => {
    setDragX(0);
    setDragging(false);
    armed.current = false;
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    maxX.current = Math.max(0, track.clientWidth - 64);
    setDragging(true);
    armed.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || disabled) return;
    const dx = Math.max(0, Math.min(maxX.current, e.clientX - startX.current));
    setDragX(dx);
    if (dx / maxX.current >= THRESHOLD) armed.current = true;
  };

  const onPointerUp = () => {
    if (!dragging) return;
    const ratio = maxX.current > 0 ? dragX / maxX.current : 0;
    if (armed.current || ratio >= THRESHOLD) {
      onBid();
    }
    reset();
  };

  const progress = maxX.current > 0 ? dragX / maxX.current : 0;

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-14 select-none overflow-hidden rounded-2xl border border-[var(--trovia-ink)]/15 bg-[var(--trovia-ink)] touch-none",
        disabled && "opacity-45",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={reset}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label={`${label} ${formatInr(amount)}`}
      aria-disabled={disabled}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-[var(--trovia-acid)]/35 transition-[width] duration-75"
        style={{ width: `${Math.max(progress * 100, 8)}%` }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 px-16 text-sm font-semibold text-[var(--trovia-paper)]">
        <span>{label}</span>
        <span className="tabular-nums text-[var(--trovia-acid)]">
          {formatInr(amount)}
        </span>
      </div>
      <div
        className={cn(
          "absolute top-1 left-1 flex h-12 w-14 items-center justify-center rounded-xl bg-[var(--trovia-acid)] text-[var(--trovia-ink)] shadow-md",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ transform: `translateX(${dragX}px)` }}
      >
        <span className="font-display text-lg leading-none">››</span>
      </div>
    </div>
  );
}
