"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function currency(amountCents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amountCents / 100);
}

function SuccessContent() {
  const sp = useSearchParams();
  const id = sp.get("payment_intent");
  const [loading, setLoading] = useState<boolean>(!!id);
  const [status, setStatus] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stripe/intent?id=${id}`);
        const json = await res.json();
        if (res.ok) {
          setStatus(json.status);
          setAmount(json.amount);
          if (json.status === "succeeded") {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
          }
        } else {
          setStatus("unknown");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const title = useMemo(() => {
    if (loading) return "Verifying payment…";
    if (status === "succeeded") return "Thank you for your generous support!";
    if (status === "processing") return "Payment is processing";
    if (status === "requires_payment_method" || status === "requires_confirmation") return "Payment not completed";
    if (status === "canceled") return "Payment canceled";
    return "Payment status";
  }, [loading, status]);

  const state: "loading" | "success" | "failed" = loading
    ? "loading"
    : status === "succeeded"
    ? "success"
    : status
    ? "failed"
    : "loading";

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="glass rounded-2xl p-10">
        {/* Indicator */}
        <div className="mx-auto mb-6 h-20 w-20 flex items-center justify-center">
          {state === "loading" && (
            <div className="h-16 w-16 rounded-full border-4 border-slate-500/40 border-t-cyan-400 animate-spin" />
          )}
          {state === "success" && (
            <div className="h-16 w-16 rounded-full bg-emerald-500/15 ring-2 ring-emerald-400 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          )}
          {state === "failed" && (
            <div className="h-16 w-16 rounded-full bg-rose-500/15 ring-2 ring-rose-400 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-semibold">{title}</h1>
        {amount != null && (
          <p className="mt-2 text-slate-300">Amount: {currency(amount)}</p>
        )}

        {state === "success" && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link href="/" className="inline-flex rounded-full px-5 py-3 glass-strong focus-ring">Back to home</Link>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://calendly.com/aryanbrite/30min"
              className="inline-flex rounded-full px-5 py-3 glass focus-ring"
            >
              Let’s connect — 15 min tea party (RSVP)
            </a>
          </div>
        )}
        {state === "failed" && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link href="/" className="inline-flex rounded-full px-5 py-3 glass focus-ring">Try again</Link>
          </div>
        )}
        {!status && !loading && (
          <div className="mt-6 text-slate-400">No payment information found.</div>
        )}
      </div>

      {/* minimal spinner animation if Tailwind's animate-spin is unavailable */}
      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="glass rounded-2xl p-10">
            <div className="mx-auto mb-6 h-20 w-20 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-slate-500/40 border-t-cyan-400 animate-spin" />
            </div>
            <h1 className="text-3xl font-semibold">Loading…</h1>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
