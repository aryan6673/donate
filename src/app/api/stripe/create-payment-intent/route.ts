import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount, recurring, coverFees, name, message, email, githubId, publicDonation } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const baseAmount = Math.max(100, Math.floor(Number(amount || 0))); // cents, $1 min
    const fees = coverFees ? Math.ceil(baseAmount * 0.029 + 30) : 0; // ~2.9% + 30c
    const finalAmount = baseAmount + fees;

    const pi = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        recurring: String(!!recurring),
        coverFees: String(!!coverFees),
        name: name || "",
        message: message || "",
        email: email || "",
        githubId: githubId || "",
        publicDonation: String(!!publicDonation),
      },
      receipt_email: email || undefined,
    });

    // Do NOT insert into DB here. Only the webhook (on success) writes to DB.

    return NextResponse.json({ clientSecret: pi.client_secret });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Stripe error" }, { status: 500 });
  }
}
