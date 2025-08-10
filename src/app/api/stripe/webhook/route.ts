import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic"; // webhooks shouldn't be static
export const runtime = "nodejs"; // Required: Stripe SDK needs Node.js runtime

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!endpointSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    // Verify signature; we don't need the event contents now
    stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook verification failed: ${err.message}` }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
