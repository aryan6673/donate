"use client";
import useSWR from "swr";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function FeaturedCarousel() {
  const { data } = useSWR("/api/github/repos", fetcher);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold">Featured Work</h2>
      <div className="mt-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 min-w-max pr-8">
          {(data ?? []).map((repo: any) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="glass w-80 shrink-0 rounded-2xl p-5 hover:translate-y-[-2px] transition"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{repo.name}</div>
                <div className="text-xs text-slate-400">★ {repo.stars}</div>
              </div>
              <p className="mt-2 text-slate-400 line-clamp-3 min-h-[60px]">{repo.description ?? "No description"}</p>
              <div className="mt-4 text-xs text-slate-400 flex items-center gap-3">
                <span>{repo.language ?? ""}</span>
                <span>Last push: {new Date(repo.pushed_at).toLocaleDateString()}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
