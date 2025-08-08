import { NextResponse } from "next/server";

export const revalidate = 15;

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/donations`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Stats error");
    const commitsYear = 420; // placeholder
    return NextResponse.json({ totalRaisedCents: data.totalRaisedCents || 0, commitsYear });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Stats error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Deprecated now that Stripe webhook writes to DB. Keep no-op for compatibility.
  try {
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Update error" }, { status: 500 });
  }
}
