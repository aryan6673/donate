"use client";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function currency(amountCents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amountCents / 100);
}

export default function SuccessPage() {
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
    return "Payment status";
  }, [loading, status]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="glass rounded-2xl p-10">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {amount != null && (
          <p className="mt-2 text-slate-300">Amount: {currency(amount)}</p>
        )}
        {status === "succeeded" && (
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
        {status && status !== "succeeded" && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link href="/" className="inline-flex rounded-full px-5 py-3 glass focus-ring">Try again</Link>
          </div>
        )}
        {!status && !loading && (
          <div className="mt-6 text-slate-400">No payment information found.</div>
        )}
      </div>
    </main>
  );
}
