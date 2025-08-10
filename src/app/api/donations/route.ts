import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "raised.txt");
    let total = 0;
    try {
      const txt = await fs.readFile(filePath, "utf8");
      total = Math.max(0, Math.floor(Number(txt.trim() || "0")));
    } catch {
      total = 0;
    }

    return NextResponse.json({ totalRaisedCents: total, donationsCount: 0, recent: [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Donations API error" }, { status: 500 });
  }
}
