import { NextResponse } from "next/server";

export const revalidate = 30; // update quick for demo

let totalRaised = 0; // in INR — replace with DB later

export async function GET() {
  try {
    // TODO: connect to your DB/payments provider to compute real time stats
    const commitsYear = 420; // placeholder
    return NextResponse.json({ totalRaised, commitsYear });
  } catch (e) {
    return NextResponse.json({ error: "Stats error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount ?? 0);
    const coverFees = Boolean(body?.coverFees);

    // naive calculation simulating payment success
    const gross = Math.max(0, amount);
    const fees = coverFees ? 0 : Math.round(gross * 0.029 + 5); // typical fee
    const net = Math.max(0, gross - fees);

    totalRaised += net;

    return NextResponse.json({ ok: true, totalRaised });
  } catch (e) {
    return NextResponse.json({ error: "Update error" }, { status: 500 });
  }
}
