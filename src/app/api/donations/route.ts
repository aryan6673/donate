import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Public read-only client (anon key) for fetching public donations and stats
function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET() {
  try {
    const supabase = getPublicClient();
    const { data: stats, error: statErr } = await supabase.from("donation_stats").select("total_raised_cents, donations_count").single();
    if (statErr) throw statErr;

    // Return a few most recent public donations for a wall (client can paginate more later)
    const { data: recent, error: recErr } = await supabase
      .from("donations")
      .select("name, message, amount_cents, created_at, github_id")
      .eq("status", "succeeded")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(10);
    if (recErr) throw recErr;

    return NextResponse.json({
      totalRaisedCents: Number(stats?.total_raised_cents ?? 0),
      donationsCount: Number(stats?.donations_count ?? 0),
      recent: recent ?? [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Donations API error" }, { status: 500 });
  }
}
