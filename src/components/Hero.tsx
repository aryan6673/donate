"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Hero() {
  const { data: profile } = useSWR("/api/github/profile", fetcher);
  const { data: stats } = useSWR("/api/stats", fetcher);

  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-10">
      {/* Neon gradient ring */}
      <div className="pointer-events-none absolute -inset-x-10 -top-24 h-56 bg-[radial-gradient(100%_100%_at_50%_0%,rgba(56,189,248,0.35),rgba(168,85,247,0.25)_45%,transparent_70%)] blur-2xl" />

      <div className="relative grid gap-10 md:grid-cols-[1.2fr_.8fr] items-center">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Support Aryan — building future-ready, open-source tools.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-300/90 max-w-2xl"
          >
            I build forever-free AI and productivity tools for learners, builders, and curious minds. Your support keeps the lights on and accelerates new features.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#donate" className="focus-ring glass-strong inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium text-white shadow-[0_0_30px_rgba(56,189,248,0.25)] ring-1 ring-white/10 transition hover:shadow-[0_0_45px_rgba(56,189,248,0.35)]">
              Donate Now
            </a>
            <a target="_blank" rel="noreferrer" href="https://github.com/aryan6673" className="focus-ring glass inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium">
              View my GitHub
            </a>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat
              label="Total raised"
              value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(((stats?.totalRaisedCents ?? 0) as number) / 100)}
            />
            <Stat label="Repos" value={profile?.public_repos ?? "—"} />
            <Stat label="Followers" value={profile?.followers ?? "—"} />
            <Stat label="Commits (yr)" value={stats?.commitsYear ?? "—"} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass rounded-2xl p-6 border-white/10"
        >
          <div className="flex items-center gap-4">
            <Image src={profile?.avatar_url ?? "/avatar.png"} alt="Aryan avatar" width={72} height={72} className="rounded-full ring-2 ring-cyan-400/30" />
            <div>
              <p className="text-lg font-medium">Aryan Singh</p>
              <p className="text-slate-400">@aryan6673</p>
            </div>
          </div>
          <p className="mt-5 text-slate-300/90 leading-relaxed">
            "I am a boy from India with millions of dreams, driven by curiosity and creativity. Exploring the endless possibilities of science, technology, and innovation."
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
