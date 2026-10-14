"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUCTION_SECONDS,
  DEMO_BUYER,
  SHIPPING_INR,
  initialChat,
  lots as seedLots,
  sellers,
  shows as seedShows,
} from "./seed";
import type {
  BidEvent,
  ChatMessage,
  DemoRole,
  Lot,
  Order,
  Show,
} from "./types";

interface TroviaState {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  shows: Show[];
  lots: Record<string, Lot>;
  chat: ChatMessage[];
  bids: BidEvent[];
  orders: Order[];
  checkoutError: string | null;
  clearCheckoutError: () => void;
  getSeller: (id: string) => (typeof sellers)[number] | undefined;
  placeBid: (showId: string, lotId: string, amount?: number) => boolean;
  createBinOrder: (showId: string, lotId: string) => Order | null;
  createWinOrder: (showId: string, lotId: string) => Order | null;
  sendChat: (showId: string, text: string) => void;
  goLive: (showId: string) => void;
  endShow: (showId: string) => void;
  pinLot: (showId: string, lotId: string) => void;
  startAuction: (showId: string, lotId: string) => void;
  passLot: (showId: string, lotId: string) => void;
  completeMockUpi: (orderId: string, succeed?: boolean) => Order | null;
  pendingOrderId: string | null;
  setPendingOrderId: (id: string | null) => void;
  loading: boolean;
}

const TroviaContext = createContext<TroviaState | null>(null);

function cloneLots(): Record<string, Lot> {
  return Object.fromEntries(
    Object.entries(seedLots).map(([k, v]) => [k, { ...v }]),
  );
}

function cloneShows(): Show[] {
  return seedShows.map((s) => ({
    ...s,
    lotIds: [...s.lotIds],
    tags: [...s.tags],
  }));
}

export function TroviaProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DemoRole>("buyer");
  const [shows, setShows] = useState<Show[]>(() => cloneShows());
  const [lots, setLots] = useState<Record<string, Lot>>(() => cloneLots());
  const [chat, setChat] = useState<ChatMessage[]>(() => [...initialChat]);
  const [bids, setBids] = useState<BidEvent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLots((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const [lotId, lot] of Object.entries(prev)) {
          if (lot.status === "live" && lot.endsAt && Date.now() >= lot.endsAt) {
            changed = true;
            next[lotId] = {
              ...lot,
              status: lot.bidCount > 0 && lot.highBidder ? "sold" : "passed",
              endsAt: null,
            };
          }
        }
        return changed ? next : prev;
      });
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const snippets = [
      { user: "riya.indore", text: "Yeh wala 🔥" },
      { user: "sam_guw", text: "Next lot kab?" },
      { user: "meera.kkd", text: "Shipping India-wide right?" },
      { user: "vikas.jp", text: "+100" },
      { user: "isha.blr", text: "Condition pe aur pics!" },
    ];
    const id = setInterval(() => {
      const live = shows.filter((s) => s.status === "live");
      if (!live.length) return;
      const show = live[Math.floor(Math.random() * live.length)];
      const snip = snippets[Math.floor(Math.random() * snippets.length)];
      setChat((c) => [
        ...c,
        {
          id: `auto-${Date.now()}`,
          showId: show.id,
          user: snip.user,
          text: snip.text,
          at: Date.now(),
          kind: "chat",
        },
      ]);
    }, 14000);
    return () => clearInterval(id);
  }, [shows]);

  const getSeller = useCallback(
    (id: string) => sellers.find((s) => s.id === id),
    [],
  );

  const placeBid = useCallback(
    (showId: string, lotId: string, amount?: number) => {
      const lot = lots[lotId];
      if (!lot || lot.status !== "live") return false;
      const nextAmount = amount ?? lot.currentBid + 100;
      if (nextAmount <= lot.currentBid) return false;

      const bidder = role === "seller" ? "host-test" : DEMO_BUYER.name;
      setLots((prev) => ({
        ...prev,
        [lotId]: {
          ...prev[lotId],
          currentBid: nextAmount,
          bidCount: prev[lotId].bidCount + 1,
          highBidder: bidder,
          endsAt:
            prev[lotId].endsAt && prev[lotId].endsAt - Date.now() < 8000
              ? Date.now() + 10000
              : prev[lotId].endsAt,
        },
      }));
      setBids((b) => [
        ...b,
        {
          id: `bid-${Date.now()}`,
          showId,
          lotId,
          user: bidder,
          amount: nextAmount,
          at: Date.now(),
        },
      ]);
      setChat((c) => [
        ...c,
        {
          id: `bidchat-${Date.now()}`,
          showId,
          user: bidder,
          text: `bid ₹${nextAmount.toLocaleString("en-IN")}`,
          at: Date.now(),
          kind: "bid",
        },
      ]);
      return true;
    },
    [lots, role],
  );

  const makeOrder = useCallback(
    (showId: string, lotId: string, amount: number): Order | null => {
      const lot = lots[lotId];
      if (!lot || lot.status === "sold" || lot.status === "passed") return null;
      const order: Order = {
        id: `ord-${Date.now()}`,
        showId,
        lotId,
        lotTitle: lot.title,
        amount,
        shipping: SHIPPING_INR,
        paymentMethod: "upi",
        status: "paid",
        buyerName: DEMO_BUYER.name,
        createdAt: Date.now(),
      };
      setOrders((o) => [...o, order]);
      setPendingOrderId(order.id);
      setCheckoutError(null);
      return order;
    },
    [lots],
  );

  const createBinOrder = useCallback(
    (showId: string, lotId: string) => {
      const lot = lots[lotId];
      if (!lot) return null;
      return makeOrder(showId, lotId, lot.buyNowPrice);
    },
    [lots, makeOrder],
  );

  const createWinOrder = useCallback(
    (showId: string, lotId: string) => {
      const lot = lots[lotId];
      if (!lot || lot.highBidder !== DEMO_BUYER.name) return null;
      return makeOrder(showId, lotId, lot.currentBid);
    },
    [lots, makeOrder],
  );

  const sendChat = useCallback(
    (showId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setChat((c) => [
        ...c,
        {
          id: `msg-${Date.now()}`,
          showId,
          user: role === "seller" ? "host" : DEMO_BUYER.handle,
          text: trimmed,
          at: Date.now(),
          kind: "chat",
        },
      ]);
    },
    [role],
  );

  const goLive = useCallback((showId: string) => {
    setShows((prev) =>
      prev.map((s) =>
        s.id === showId
          ? {
              ...s,
              status: "live",
              startedAt: Date.now(),
              viewers: Math.max(s.viewers, 12),
              currentLotId: s.currentLotId ?? s.lotIds[0] ?? null,
            }
          : s,
      ),
    );
    setChat((c) => [
      ...c,
      {
        id: `sys-live-${Date.now()}`,
        showId,
        user: "system",
        text: "Show is LIVE — thrift drop across India ✨",
        at: Date.now(),
        kind: "system",
      },
    ]);
  }, []);

  const endShow = useCallback(
    (showId: string) => {
      setShows((prev) =>
        prev.map((s) => (s.id === showId ? { ...s, status: "ended" } : s)),
      );
      setLots((prev) => {
        const show = shows.find((s) => s.id === showId);
        if (!show) return prev;
        const next = { ...prev };
        for (const lotId of show.lotIds) {
          if (next[lotId]?.status === "live") {
            next[lotId] = { ...next[lotId], status: "passed", endsAt: null };
          }
        }
        return next;
      });
    },
    [shows],
  );

  const pinLot = useCallback(
    (showId: string, lotId: string) => {
      setShows((prev) =>
        prev.map((s) => (s.id === showId ? { ...s, currentLotId: lotId } : s)),
      );
      setLots((prev) => {
        const next = { ...prev };
        const show = shows.find((s) => s.id === showId);
        if (show) {
          for (const id of show.lotIds) {
            if (next[id]?.status === "live" && id !== lotId) {
              next[id] = { ...next[id], status: "queued", endsAt: null };
            }
          }
        }
        if (next[lotId] && next[lotId].status !== "sold") {
          next[lotId] = {
            ...next[lotId],
            status: "live",
            endsAt: null,
            currentBid: next[lotId].startingBid,
            bidCount: 0,
            highBidder: null,
          };
        }
        return next;
      });
      setChat((c) => [
        ...c,
        {
          id: `pin-${Date.now()}`,
          showId,
          user: "system",
          text: `Now up: ${lots[lotId]?.title ?? "next lot"}`,
          at: Date.now(),
          kind: "system",
        },
      ]);
    },
    [shows, lots],
  );

  const startAuction = useCallback((showId: string, lotId: string) => {
    setLots((prev) => {
      const lot = prev[lotId];
      if (!lot) return prev;
      return {
        ...prev,
        [lotId]: {
          ...lot,
          status: "live",
          endsAt: Date.now() + AUCTION_SECONDS * 1000,
          currentBid: lot.bidCount === 0 ? lot.startingBid : lot.currentBid,
        },
      };
    });
    setShows((prev) =>
      prev.map((s) => (s.id === showId ? { ...s, currentLotId: lotId } : s)),
    );
    setChat((c) => [
      ...c,
      {
        id: `auc-${Date.now()}`,
        showId,
        user: "system",
        text: `Auction started · ${AUCTION_SECONDS}s`,
        at: Date.now(),
        kind: "system",
      },
    ]);
  }, []);

  const passLot = useCallback((showId: string, lotId: string) => {
    setLots((prev) => ({
      ...prev,
      [lotId]: { ...prev[lotId], status: "passed", endsAt: null },
    }));
    setChat((c) => [
      ...c,
      {
        id: `pass-${Date.now()}`,
        showId,
        user: "system",
        text: "Lot passed — next!",
        at: Date.now(),
        kind: "system",
      },
    ]);
  }, []);

  const completeMockUpi = useCallback(
    (orderId: string, succeed = true): Order | null => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return null;
      if (!succeed) {
        setCheckoutError(
          "UPI payment failed. Try again — prepaid only on Trovia.",
        );
        setOrders((o) => o.filter((ord) => ord.id !== orderId));
        setPendingOrderId(null);
        return null;
      }
      setCheckoutError(null);
      setLots((prev) => ({
        ...prev,
        [order.lotId]: {
          ...prev[order.lotId],
          status: "sold",
          currentBid: order.amount,
          highBidder: DEMO_BUYER.name,
          endsAt: null,
          bidCount: prev[order.lotId].bidCount + 1,
        },
      }));
      setChat((c) => [
        ...c,
        {
          id: `sold-${Date.now()}`,
          showId: order.showId,
          user: "system",
          text: `Sold · ${order.lotTitle} → ${DEMO_BUYER.name}`,
          at: Date.now(),
          kind: "system",
        },
      ]);
      setPendingOrderId(null);
      return order;
    },
    [orders],
  );

  const clearCheckoutError = useCallback(() => setCheckoutError(null), []);

  const value = useMemo<TroviaState>(
    () => ({
      role,
      setRole,
      shows,
      lots,
      chat,
      bids,
      orders,
      checkoutError,
      clearCheckoutError,
      getSeller,
      placeBid,
      createBinOrder,
      createWinOrder,
      sendChat,
      goLive,
      endShow,
      pinLot,
      startAuction,
      passLot,
      completeMockUpi,
      pendingOrderId,
      setPendingOrderId,
      loading,
    }),
    [
      role,
      shows,
      lots,
      chat,
      bids,
      orders,
      checkoutError,
      clearCheckoutError,
      getSeller,
      placeBid,
      createBinOrder,
      createWinOrder,
      sendChat,
      goLive,
      endShow,
      pinLot,
      startAuction,
      passLot,
      completeMockUpi,
      pendingOrderId,
      loading,
    ],
  );

  return (
    <TroviaContext.Provider value={value}>{children}</TroviaContext.Provider>
  );
}

export function useTrovia() {
  const ctx = useContext(TroviaContext);
  if (!ctx) throw new Error("useTrovia must be used within TroviaProvider");
  return ctx;
}

export { sellers, SHIPPING_INR, AUCTION_SECONDS };
