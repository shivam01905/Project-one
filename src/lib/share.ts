import type { Lot, Seller, Show } from "./types";

const FOLLOW_KEY = "trovia.follows.v1";

export function loadFollows(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FOLLOW_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveFollows(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FOLLOW_KEY, JSON.stringify(ids));
}

export function appOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "http://127.0.0.1:43127";
}

export function showDeepLink(showId: string): string {
  return `${appOrigin()}/live/${showId}`;
}

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Clip-card style Hinglish copy for WA */
export function shareCopyShow(show: Show, seller: Seller | undefined): string {
  const link = showDeepLink(show.id);
  const host = seller?.displayName ?? "Trovia host";
  return (
    `${host} LIVE hai Trovia pe 🔥\n` +
    `${show.title} · ${show.titleHi}\n` +
    `Thrift drop — swipe, bid, UPI. WhatsApp pe mat rukna, andar aao:\n` +
    link
  );
}

export function shareCopyLot(
  show: Show,
  seller: Seller | undefined,
  lot: Lot,
): string {
  const link = showDeepLink(show.id);
  const host = seller?.displayName ?? "host";
  return (
    `Abhi camera pe · ${lot.title}\n` +
    `${host} ke show mein on Trovia 👀\n` +
    `Current vibe · peep + bid live:\n` +
    link
  );
}

export function shareCopyWin(
  show: Show,
  seller: Seller | undefined,
  lotTitle: string,
): string {
  const link = showDeepLink(show.id);
  const host = seller?.displayName ?? "seller";
  return (
    `Jeet gaya thrift ✨ ${lotTitle}\n` +
    `${host} · Trovia live se\n` +
    `Show abhi chal raha hai — aao dekho:\n` +
    link
  );
}
