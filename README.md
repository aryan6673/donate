# Donate App (Stripe-only)

Next.js app with Stripe Payments. Totals and recent donors are computed directly from Stripe PaymentIntents.

## Setup

1) Install deps
- npm install

2) Env (.env.local)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
- STRIPE_SECRET_KEY=sk_test_...
- STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe CLI or Dashboard)
- Optional: GITHUB_TOKEN=ghp_...

3) Dev webhook
- npm run dev
- In another terminal: stripe listen --forward-to localhost:3000/api/stripe/webhook
- Put the printed whsec_... into STRIPE_WEBHOOK_SECRET; restart dev.

## How totals work
- API: GET /api/donations
  - Sums amount_received for PaymentIntents with status=succeeded and currency=usd
  - Returns totalRaisedCents, donationsCount, and up to 10 recent donors where metadata.publicDonation === "true"
- API: GET /api/stats proxies totals for the Hero section.

## Donor data
- Stored in PaymentIntent metadata: name, githubId, message, publicDonation
- Email comes from receipt_email or charges[i].billing_details.email
- You can export from Stripe Dashboard → Payments (include Metadata columns).
