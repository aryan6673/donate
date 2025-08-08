"use client";
import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import confetti from "canvas-confetti";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());
const TIERS = [150, 599, 1499, 4999];

function currency(amountCents: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amountCents / 100);
}

function impactFor(amount: number) {
  if (amount < 300) return "1 week of uptime & monitoring";
  if (amount < 1000) return "1 month hosting for a project";
  if (amount < 2500) return "1 feature sprint or bug bounty";
  return "2+ community bounties funded";
}

function DonateForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amountCents, setAmountCents] = useState(TIERS[1]);
  const [coverFees, setCoverFees] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [publicDonation, setPublicDonation] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: stats, mutate } = useSWR("/api/stats", fetcher);

  useEffect(() => {
    const createPI = async () => {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountCents, coverFees, name, message, email, publicDonation, recurring: false }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Failed to create payment intent");
      } else {
        setClientSecret(json.clientSecret);
      }
      setLoading(false);
    };
    createPI();
  }, [amountCents, coverFees, name, message, email, publicDonation]);

  const handleDonate = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setError(submitErr.message || "Payment form error");
      setLoading(false);
      return;
    }

    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmErr) {
      setError(confirmErr.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      await fetch("/api/stats", { method: "POST", body: JSON.stringify({ amountCents }) });
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
    }

    setLoading(false);
  };

  const impact = useMemo(() => {
    if (amountCents < 700) return "Covers server uptime for a few days";
    if (amountCents < 2000) return "Funds a small feature or bugfix sprint";
    if (amountCents < 6000) return "Supports a full feature sprint + tests";
    return "Funds multiple bounties and contributor sponsorships";
  }, [amountCents]);

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div>
        <div className="flex flex-wrap gap-2">
          {TIERS.map((t) => (
            <button key={t} onClick={() => setAmountCents(t)} className={`focus-ring rounded-full px-4 py-2 text-sm glass ${amountCents === t ? "ring-2 ring-cyan-400/60" : ""}`}>
              {currency(t)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-400">Custom amount: {currency(amountCents)}</label>
          <input className="mt-2 w-full" type="range" min={300} max={20000} step={100} value={amountCents} onChange={(e) => setAmountCents(Number(e.target.value))} />
        </div>

        <div className="mt-4 grid gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={coverFees} onChange={(e) => setCoverFees(e.target.checked)} /> Cover processing fees
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={publicDonation} onChange={(e) => setPublicDonation(e.target.checked)} /> Show on public wall
          </label>
        </div>

        <div className="mt-4 grid gap-3">
          <input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="glass rounded-lg px-3 py-2" />
          <input placeholder="Email for receipt (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="glass rounded-lg px-3 py-2" />
          <textarea placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} className="glass rounded-lg px-3 py-2 min-h-20" />
        </div>

        <p className="mt-3 text-sm text-slate-400">Impact: {impact}</p>
      </div>

      <div>
        {clientSecret ? (
          <PaymentElement options={{ layout: "tabs" }} />
        ) : (
          <div className="text-slate-400">Loading payment form…</div>
        )}
        {error && <p className="mt-3 text-rose-400 text-sm">{error}</p>}
        <button onClick={handleDonate} disabled={!clientSecret || !stripe || !elements || loading} className="mt-4 focus-ring glass-strong w-full rounded-xl py-3 font-medium">
          {loading ? "Processing…" : "Donate with Stripe"}
        </button>
      </div>
    </div>
  );
}

export default function DonateControl() {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (key) setStripePromise(loadStripe(key));
  }, []);

  if (!stripePromise) {
    return <div className="mt-4 text-slate-400">Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to load Stripe checkout.</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: "night" } }}>
      <DonateForm />
    </Elements>
  );
}
