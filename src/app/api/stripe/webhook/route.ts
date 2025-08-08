import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic"; // webhooks shouldn't be static
export const runtime = "nodejs"; // Required: Stripe SDK needs Node.js runtime

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!endpointSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const amount = pi.amount_received || pi.amount || 0;
      const currency = pi.currency || "usd";
      const md = (pi.metadata || {}) as any;
      await supabase.from("donations").upsert({
        payment_intent_id: pi.id,
        amount_cents: amount,
        currency,
        status: "succeeded",
        name: md.name || null,
        email: md.email || null,
        github_id: md.githubId || null,
        message: md.message || null,
        is_public: md.publicDonation === "true",
        cover_fees: md.coverFees === "true",
        recurring: md.recurring === "true",
      }, { onConflict: "payment_intent_id" });
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
