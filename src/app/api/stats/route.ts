import { NextResponse } from "next/server";

export const revalidate = 30; // short revalidate for demo

let totalRaisedCents = 0; // USD cents — replace with DB later

export async function GET() {
  try {
    const commitsYear = 420; // placeholder
    return NextResponse.json({ totalRaisedCents, commitsYear });
  } catch (e) {
    return NextResponse.json({ error: "Stats error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amountCents = Math.max(0, Math.floor(Number(body?.amountCents ?? 0)));
    totalRaisedCents += amountCents;
    return NextResponse.json({ ok: true, totalRaisedCents });
  } catch (e) {
    return NextResponse.json({ error: "Update error" }, { status: 500 });
  }
}
