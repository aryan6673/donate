# Donate App

This is a Next.js app with Stripe payments and Supabase-backed donation stats.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Setup

1) Install dependencies
- npm install

2) Environment variables: create a `.env.local` with:

```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3) Supabase schema
- Open Supabase project → SQL Editor
- Paste and run the SQL from `supabase.sql`

4) Stripe webhook
- Start dev server: `npm run dev`
- In another terminal, run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Copy the signing secret it prints (starts with `whsec_...`) into `STRIPE_WEBHOOK_SECRET`

5) Run
- npm run dev
- Open http://localhost:3000

## How it works
- Client creates Payment Intents via `/api/stripe/create-payment-intent`.
- We insert a `processing` donation row; the official status is updated by the Stripe webhook.
- `/api/donations` reads public stats and latest public donations from Supabase.
- `Hero` reads totals from `/api/donations`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
