import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const revalidate = 30;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "raised.txt");
    let total = 0;
    try {
      const txt = await fs.readFile(filePath, "utf8");
      total = Math.max(0, Math.floor(Number((txt || "").trim()) || 0));
    } catch {
      total = 0;
    }

    const commitsYear = 420; // placeholder, can be replaced with GitHub API later
    return NextResponse.json({ totalRaisedCents: total, commitsYear });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Stats error" }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ ok: true });
}
