"use client";

import type { Seller, Show } from "@/lib/types";
import { FollowButton } from "@/components/follow-button";
import { TrustBadge } from "@/components/trust-badge";
import { cn } from "@/lib/utils";

function HostChip({
  seller,
  role,
  active,
  onSelect,
}: {
  seller: Seller;
  role: "host" | "co-host";
  active?: boolean;
  onSelect?: () => void;
}) {
  const initial = seller.displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition",
        active
          ? "border-[var(--trovia-acid)]/50 bg-[var(--trovia-acid)]/15"
          : "border-white/15 bg-black/40 hover:bg-black/55",
      )}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[var(--trovia-ink)]"
        style={{
          background: `linear-gradient(145deg, hsl(${role === "host" ? 200 : 340} 45% 62%), hsl(${role === "host" ? 220 : 20} 35% 35%))`,
        }}
      >
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-semibold text-white">
          {seller.displayName.split("·")[0].trim()}
        </span>
        <span className="flex flex-wrap items-center gap-1">
          <span className="text-[9px] uppercase tracking-wider text-white/50">
            {role === "host" ? "Host" : "Co-host"} · {seller.city}
          </span>
          <TrustBadge seller={seller} variant="dark" size="sm" />
        </span>
      </span>
    </button>
  );
}

export function CoHostRail({
  show,
  host,
  coHosts,
  activeSellerId,
  onSelectSeller,
}: {
  show: Show;
  host: Seller;
  coHosts: Seller[];
  activeSellerId?: string | null;
  onSelectSeller?: (sellerId: string) => void;
}) {
  if (!show.coHostIds?.length || !coHosts.length) return null;

  return (
    <div className="pointer-events-auto space-y-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-white/12 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/85">
          Collab room
        </span>
        <span className="text-[10px] text-white/50">
          Shared thrift night · not gift PK
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <HostChip
          seller={host}
          role="host"
          active={activeSellerId === host.id}
          onSelect={() => onSelectSeller?.(host.id)}
        />
        {coHosts.map((c) => (
          <HostChip
            key={c.id}
            seller={c}
            role="co-host"
            active={activeSellerId === c.id}
            onSelect={() => onSelectSeller?.(c.id)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <FollowButton sellerId={host.id} variant="dark" size="sm" />
        {coHosts.map((c) => (
          <FollowButton key={c.id} sellerId={c.id} variant="dark" size="sm" />
        ))}
      </div>
    </div>
  );
}
