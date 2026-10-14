"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types";
import { useTrovia } from "@/lib/store";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckoutSheet({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { completeMockUpi, checkoutError, clearCheckoutError } = useTrovia();
  const [upi, setUpi] = useState("you@oksbi");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !order) return null;

  const total = order.amount + order.shipping;

  async function pay(succeed: boolean) {
    if (!order) return;
    const id = order.id;
    setBusy(true);
    clearCheckoutError();
    await new Promise((r) => setTimeout(r, 700));
    const result = completeMockUpi(id, succeed);
    setBusy(false);
    if (result) {
      onOpenChange(false);
      router.push(`/order/${id}`);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onClick={() => {
        clearCheckoutError();
        onOpenChange(false);
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-paper)] p-5 shadow-xl animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="checkout-title"
          className="font-display text-2xl tracking-tight"
        >
          Pay with UPI
        </h2>
        <p className="mt-1 text-sm text-[var(--trovia-muted)]">
          Prepaid only · mock sandbox. No COD at launch.
        </p>

        <div className="mt-4 space-y-3 rounded-xl bg-[var(--trovia-ink)]/[0.04] p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[var(--trovia-muted)]">Item</span>
            <span className="max-w-[60%] text-right font-medium">
              {order.lotTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--trovia-muted)]">Price</span>
            <span>{formatInr(order.amount)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[var(--trovia-muted)]">
              Shipping (courier · 3–7 days, India-wide)
            </span>
            <span>{formatInr(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--trovia-ink)]/10 pt-3 font-semibold">
            <span>Total</span>
            <span>{formatInr(total)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-xs uppercase tracking-wider text-[var(--trovia-muted)]">
            UPI ID
          </label>
          <Input
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="name@upi"
          />
        </div>

        {checkoutError && (
          <p className="mt-3 rounded-lg bg-[var(--trovia-coral)]/15 px-3 py-2 text-sm text-[var(--trovia-coral)]">
            {checkoutError}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            disabled={busy || !upi.includes("@")}
            onClick={() => pay(true)}
            className="flex-1 bg-[var(--trovia-acid)] font-semibold text-[var(--trovia-ink)] hover:bg-[var(--trovia-acid)]/90"
          >
            {busy ? "Processing…" : `Pay ${formatInr(total)}`}
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => pay(false)}
            className="border-[var(--trovia-ink)]/15"
          >
            Simulate fail
          </Button>
        </div>
      </div>
    </div>
  );
}
