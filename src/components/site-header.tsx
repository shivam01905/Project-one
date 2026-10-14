"use client";

import Link from "next/link";
import { useTrovia } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { role, setRole } = useTrovia();

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
      <Link href="/" className="group flex items-baseline gap-2">
        <span className="font-display text-2xl tracking-tight text-[var(--trovia-ink)] sm:text-3xl">
          Trovia
        </span>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--trovia-muted)] sm:inline">
          thrift live
        </span>
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="rounded-md px-2 py-1.5 text-sm text-[var(--trovia-ink)]/80 transition hover:text-[var(--trovia-ink)]"
        >
          Discover
        </Link>
        <Link
          href="/seller"
          className="rounded-md px-2 py-1.5 text-sm text-[var(--trovia-ink)]/80 transition hover:text-[var(--trovia-ink)]"
        >
          Sell
        </Link>
        <div className="ml-1 flex rounded-full border border-[var(--trovia-ink)]/15 bg-[var(--trovia-ink)]/5 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={cn(
              "rounded-full px-2.5 py-1 transition",
              role === "buyer"
                ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
                : "text-[var(--trovia-muted)]",
            )}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={cn(
              "rounded-full px-2.5 py-1 transition",
              role === "seller"
                ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
                : "text-[var(--trovia-muted)]",
            )}
          >
            Seller
          </button>
        </div>
      </nav>
    </header>
  );
}
