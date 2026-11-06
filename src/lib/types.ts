export type DemoRole = "buyer" | "seller";

export type LotStatus = "queued" | "live" | "sold" | "passed";

export type AuctionMode = "soft" | "sudden";

export type ShowStatus = "scheduled" | "live" | "ended";

export type KycStatus = "verified" | "pending";

export interface Seller {
  id: string;
  handle: string;
  displayName: string;
  city: string;
  bio: string;
  verified: boolean;
  /** Invite-only seller identity check (demo) */
  kycStatus: KycStatus;
  /** Short badge copy, e.g. "KYC · invite seller" */
  kycLabel: string;
}

/** Thrift condition-talk cue — host walks these on camera */
export interface ConditionCue {
  id: string;
  label: string;
  labelHi?: string;
  checked: boolean;
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
  /** Whose closet in a dual-host collab room */
  ownerSellerId?: string;
  /** Condition-talk checklist for thrift trust */
  conditionCues?: ConditionCue[];
}

/** Shoppable VOD marker — jump to a lot moment in replay */
export interface VodHighlight {
  lotId: string;
  /** Seconds into the demo replay */
  atSec: number;
  label: string;
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
  /** Demo replay length (seconds); set for ended shows with VOD */
  vodDurationSec?: number;
  /** Jump-to-lot timestamps for auto VOD after live */
  vodHighlights?: VodHighlight[];
  /**
   * Dual-host thrift collab — shared room / co-hosts.
   * Not gift-scored PK.
   */
  coHostIds?: string[];
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
