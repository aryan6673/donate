"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

const TIERS = [150, 599, 1499, 4999];

function impactFor(amount: number) {
  if (amount < 300) return "1 week of uptime & monitoring";
  if (amount < 1000) return "1 month hosting for a project";
  if (amount < 2500) return "1 feature sprint or bug bounty";
  return "2+ community bounties funded";
}

export default function DonateControl() {
  const [amount, setAmount] = useState<number>(599);
  const [recurring, setRecurring] = useState(false);
  const [coverFees, setCoverFees] = useState(true);
  const [privacy, setPrivacy] = useState<"public" | "anon">("public");
  const { data: stats, mutate } = useSWR("/api/stats", fetcher);

  const fees = useMemo(() => (coverFees ? Math.round(amount * 0.029 + 5) : 0), [amount, coverFees]);
  const total = amount + fees;

  async function donate() {
    // Placeholder: simulate a success and update counter
    const res = await fetch("/api/stats", { method: "POST", body: JSON.stringify({ amount, coverFees }) });
    const json = await res.json();
    mutate({ ...stats, totalRaised: json.totalRaised }, { revalidate: false });
    // TODO: open Stripe/UPI/PayPal modal
  }

  return (
    <div className="mt-6 grid gap-6">
      <div className="flex flex-wrap gap-2">
        {TIERS.map(t => (
          <button key={t} onClick={() => setAmount(t)} className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition ${amount === t ? "glass-strong" : "glass"}`}>
            ₹{t.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      <div>
        <input type="range" min={50} max={10000} step={25} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full" />
        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <span>Custom: ₹{amount.toLocaleString("en-IN")}</span>
          <span>{impactFor(amount)}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="glass rounded-xl p-3 flex items-center gap-2">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
          <span>Make this monthly</span>
        </label>
        <label className="glass rounded-xl p-3 flex items-center gap-2">
          <input type="checkbox" checked={coverFees} onChange={(e) => setCoverFees(e.target.checked)} />
          <span>Cover processing fees</span>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className={`glass rounded-xl p-3 flex items-center gap-2 ${privacy === "public" ? "ring-1 ring-white/20" : ""}`}>
          <input type="radio" name="privacy" checked={privacy === "public"} onChange={() => setPrivacy("public")} />
          <span>Public wall</span>
        </label>
        <label className={`glass rounded-xl p-3 flex items-center gap-2 ${privacy === "anon" ? "ring-1 ring-white/20" : ""}`}>
          <input type="radio" name="privacy" checked={privacy === "anon"} onChange={() => setPrivacy("anon")} />
          <span>Anonymous</span>
        </label>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-300">
        <div>
          <div>Subtotal: ₹{amount.toLocaleString("en-IN")}</div>
          {coverFees && <div className="text-slate-400">Fees: ₹{fees.toLocaleString("en-IN")}</div>}
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Total</div>
          <div className="text-xl font-semibold">₹{total.toLocaleString("en-IN")}</div>
        </div>
      </div>

      <button onClick={donate} className="focus-ring glass-strong rounded-xl px-5 py-3 text-base font-semibold shadow-[0_0_30px_rgba(34,197,94,0.25)]">
        Donate securely
      </button>

      <p className="text-xs text-slate-500">UPI/Stripe/PayPal integration coming next. Secure checkout with Apple/Google Pay supported.</p>
    </div>
  );
}
