import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const pi = await stripe.paymentIntents.retrieve(id);
    return NextResponse.json({ status: pi.status, amount: pi.amount, currency: pi.currency });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Stripe error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, metadata, receipt_email } = body || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const pi = await stripe.paymentIntents.update(id, {
      metadata: {
        ...(metadata || {}),
        publicDonation: metadata?.publicDonation !== undefined ? String(!!metadata.publicDonation) : undefined,
        coverFees: metadata?.coverFees !== undefined ? String(!!metadata.coverFees) : undefined,
        recurring: metadata?.recurring !== undefined ? String(!!metadata.recurring) : undefined,
      } as any,
      receipt_email: receipt_email || undefined,
    });

    return NextResponse.json({ ok: true, status: pi.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Stripe update error" }, { status: 500 });
  }
}
