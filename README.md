# Trovia

**Thrift live shopping for India** — Whatnot-style seller shows, live bids, chat, and UPI-first prepaid checkout. Pan-India preloved fashion with collector/community energy (not mass discount commerce).

This repo is the first usable product slice: discover a live thrift show, watch a live-room UI (mock stream + chat + current item), bid or Buy It Now, and complete a mock UPI checkout. Sellers get a simple go-live / show control panel.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- In-memory seed data + client state (no database required for the demo)
- Mock stream placeholder (not WebRTC) and mock UPI sandbox

## Run locally

```bash
npm install
npm run dev -- -p 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

### Demo roles

- **Buyer** (default): Discover → Live room → Bid / Buy Now → mock UPI
- **Seller**: `/seller` → Go live → Pin lot → Start auction (switch header toggle to Buyer in another tab/flow to bid)

## Product locks (MVP)

| Lock | Value |
| --- | --- |
| Category | Thrift / preloved fashion |
| Geography | Pan-India (Hindi + English UI; hosts any language on camera) |
| Payments | UPI-first, prepaid only (no COD) |
| Sellers | Invite-only curated + demo KYC |
| Shipping copy | India-wide seller-fulfilled courier (3–7 days) — not same-day |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Out of scope (this slice)

Full catalog marketplace · affiliate · COD · real WebRTC · authenticity partners · same-day delivery · multi-category.
