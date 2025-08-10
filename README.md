# Donation page

![Screenshot](/assets/ss.png)

Next.js app with Stripe Payments and a simple, manual total raised. No database. The UI reads the total (in cents) from `public/raised.txt`.

## Use this template (fork and make it your own)
1) On GitHub, click "Use this template" (or Fork) to create your repo.
2) Clone your new repo locally.
3) Set env vars (see below) in `.env.local`.
4) Set your starting total: edit `public/raised.txt` and put an integer amount in cents (e.g., `0` or `12345`).
5) Optional: update the GitHub corner link to your repo in `src/app/layout.tsx` (the top-right bookmark link).
6) Install and run:
   - npm install
   - npm run dev
7) For local webhooks (optional but recommended for testing):
   - stripe listen --forward-to localhost:3000/api/stripe/webhook
   - Put the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` and restart dev.

## Environment
Put these in `.env.local`:
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
- STRIPE_SECRET_KEY=sk_test_...
- STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe CLI or Dashboard)
- Optional: GITHUB_TOKEN=ghp_... (for higher GitHub API rate limits)

## How totals work
- `public/raised.txt` holds the public total, as an integer number of cents.
- API `GET /api/donations` and `GET /api/stats` both read this file and return `totalRaisedCents` to the UI.
- There is no database write and no automatic aggregation from Stripe. Update the total by editing `public/raised.txt` (commit/deploy as needed).

## Stripe flow (what gets stored)
- Stripe Elements + PaymentIntents; confirmation happens client-side.
- Required fields: name and email are validated before confirmation.
- Metadata attached to the PaymentIntent: `name`, `githubId`, `message`, `publicDonation`.
- Email is set via `receipt_email` for receipts.
- The webhook verifies signatures and returns 200 (no DB writes).

## Deploy
- Works great on Vercel. Add env vars in the dashboard. Ensure `public/raised.txt` is present in your repo.

## License
MIT. See `LICENSE`.
