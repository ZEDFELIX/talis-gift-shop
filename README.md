# Talis Gift Shop

**Beyond the Feeling** — a premium gifting e-commerce experience for Nairobi & countrywide Kenya.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS and Prisma/SQLite.

## Quick start

```bash
npm install
npm run db:push     # create SQLite database from prisma/schema.prisma
npm run db:seed     # seed products, categories, discounts, demo order & users
npm run dev         # http://localhost:3000
```

### Demo credentials

| Role     | Email                      | Password         |
| -------- | -------------------------- | ---------------- |
| Admin    | admin@talisgiftshop.co.ke  | `TalisAdmin123!` |
| Customer | sarah@example.com          | `Password123!`   |

Demo order for tracking: **TG-DEMO001**.

## Environment variables (.env)

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me-in-production"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# M-PESA Daraja (optional — checkout falls back to paybill + manual confirmation)
MPESA_ENV="sandbox"
MPESA_CONSUMER_KEY=""
MPESA_CONSUMER_SECRET=""
MPESA_SHORTCODE=""
MPESA_PASSKEY=""
MPESA_CALLBACK_URL=""
MPESA_WEBHOOK_SECRET="set-a-long-random-string"
```

## Feature map

- Catalog with search, filters (price/recipients/feelings), sorting, pagination — `/shop`
- Collections, occasions, new arrivals, best sellers, personalized picks
- Product pages: gallery, variants, personalization fields, reviews, related gifts
- Gift box builder — `/build-your-gift` (server-priced via configurable fees)
- Cart drawer + cart page with discount codes (`WELCOME10`, `TALISLOVE`, `BIRTHDAY15`)
- Checkout: guest or account, free countrywide delivery, M-PESA STK / COD, gift note
- Payments: full M-PESA Daraja STK push (`CustomerPayBillOnline` default; set `MPESA_TXN_TYPE=CustomerBuyGoodsOnline` for Till numbers), signed webhook auto-confirmation, status polling; manual admin confirmation fallback
- Accounts: register/login, profile, addresses, order history, reorder
- Order tracking by number + phone/email — `/track-order`
- Wishlist (device-synced when signed in)
- Reviews with moderation queue
- Admin at `/admin`: dashboard stats + 14-day revenue chart, product CRUD, order fulfillment (status flow, manual payment confirm, cancel/restock/refund), categories, collections, discounts, reviews, customers, store settings

## Notes for production

- Swap SQLite → Postgres: change the `provider` in `prisma/schema.prisma`, update `DATABASE_URL`, run `npx prisma db push`. The schema intentionally avoids SQLite-only features. Required before taking real payments on Vercel (serverless FS is ephemeral).
- Set real Daraja credentials; the payment provider abstraction lives in `lib/payments.ts`.
- Serve placeholder art from `public/images/*.svg` — replace with real photography (same filenames) without code changes.

## Deployment

- **GitHub**: push to `main` — Vercel is connected and auto-deploys every push to production (https://talis-gift-shop.vercel.app).
- **Manual**: `vercel deploy --prod` from the project root.
- Required Vercel env vars (Production): `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, plus `MPESA_*` for payments.
- Health check: `GET /api/health` returns service status, active product count and M-PESA configuration state.

