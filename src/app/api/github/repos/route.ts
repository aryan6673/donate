import { NextResponse } from "next/server";

export const revalidate = 3600;

const repos = [
  "DeyWeaver",
  "Numerology-app",
  "donate",
  "eduai",
  "InstaTools",
  "NoteScape-2.0",
];

export async function GET() {
  try {
    const headers = new Headers();
    if (process.env.GITHUB_TOKEN) headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);

    const data = await Promise.all(
      repos.map(async (name) => {
        const res = await fetch(`https://api.github.com/repos/aryan6673/${name}`, { headers, next: { revalidate } });
        if (!res.ok) return null;
        const json = await res.json();
        return {
          id: json.id,
          name: json.name,
          description: json.description,
          stars: json.stargazers_count,
          forks: json.forks_count,
          language: json.language,
          html_url: json.html_url,
          pushed_at: json.pushed_at,
        };
      })
    );
    return NextResponse.json(data.filter(Boolean), { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Repos fetch error" }, { status: 500 });
  }
}
