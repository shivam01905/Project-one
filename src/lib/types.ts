export type DemoRole = "buyer" | "seller";

export type LotStatus = "queued" | "live" | "sold" | "passed";

export type AuctionMode = "soft" | "sudden";

export type ShowStatus = "scheduled" | "live" | "ended";

export interface Seller {
  id: string;
  handle: string;
  displayName: string;
  city: string;
  bio: string;
  verified: boolean;
}

export interface Lot {
  id: string;
  title: string;
  subtitle: string;
  condition: string;
  size: string;
  startingBid: number;
  buyNowPrice: number;
  currentBid: number;
  bidCount: number;
  highBidder: string | null;
  status: LotStatus;
  imageHue: number;
  endsAt: number | null;
  /** soft = bid near end extends timer; sudden = no extension (Whatnot 💀) */
  auctionMode: AuctionMode;
}

export interface Show {
  id: string;
  title: string;
  titleHi: string;
  sellerId: string;
  status: ShowStatus;
  viewers: number;
  tags: string[];
  coverHue: number;
  currentLotId: string | null;
  lotIds: string[];
  startedAt: number | null;
}

export interface ChatMessage {
  id: string;
  showId: string;
  user: string;
  text: string;
  at: number;
  kind: "chat" | "system" | "bid";
}

export interface BidEvent {
  id: string;
  showId: string;
  lotId: string;
  user: string;
  amount: number;
  at: number;
}

export interface Order {
  id: string;
  showId: string;
  lotId: string;
  lotTitle: string;
  amount: number;
  shipping: number;
  paymentMethod: "upi";
  status: "paid" | "failed";
  buyerName: string;
  createdAt: number;
}
