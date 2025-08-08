"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function FeaturedCarousel() {
  const { data } = useSWR("/api/github/repos", fetcher);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanLeft(scrollLeft > 8);
      setCanRight(scrollLeft + clientWidth < scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [data]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.min(640, el.clientWidth - 80));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Convert vertical wheel to horizontal for better UX
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollerRef.current?.scrollBy({ left: e.deltaY, behavior: "smooth" });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold">Featured Work</h2>
      <div className="relative mt-6">
        {/* Scroller */}
        <div
          ref={scrollerRef}
          onWheel={onWheel}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
          <div className="flex gap-4 min-w-max pr-12">
            {(data ?? []).map((repo: any) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="glass w-80 shrink-0 rounded-2xl p-5 hover:translate-y-[-2px] transition snap-start"
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

        {/* Edge fades */}
        {canLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent opacity-70" />
        )}
        {canRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent opacity-70" />
        )}

        {/* Arrow controls */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            disabled={!canLeft}
            className={`glass rounded-full p-2 transition ${canLeft ? "opacity-100" : "opacity-40 cursor-not-allowed"}`}
          >
            ‹
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            disabled={!canRight}
            className={`glass rounded-full p-2 transition ${canRight ? "opacity-100" : "opacity-40 cursor-not-allowed"}`}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
