import { NextResponse } from "next/server";

export const revalidate = 30;

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

export async function POST() {
  return NextResponse.json({ ok: true });
}
