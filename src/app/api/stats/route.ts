import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 15;

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET() {
  try {
    const supabase = getPublicClient();
    const { data: stats, error } = await supabase.from("donation_stats").select("total_raised_cents").single();
    if (error) throw error;
    const commitsYear = 420; // placeholder
    return NextResponse.json({ totalRaisedCents: Number(stats?.total_raised_cents ?? 0), commitsYear });
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
