"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="glass rounded-2xl p-10">
        <h1 className="text-3xl font-semibold">Thank you!</h1>
        <p className="mt-3 text-slate-300">Your support helps keep the projects alive and improving.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full px-5 py-3 glass-strong focus-ring">Return home</Link>
      </div>
    </main>
  );
}
