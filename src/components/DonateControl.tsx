"use client";
import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import confetti from "canvas-confetti";
import { useSWRConfig } from "swr";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const TIERS = [500, 999, 2499, 9999]; // cents: $5, $9.99, $24.99, $99.99

function currency(amountCents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amountCents / 100);
}

function validEmail(v: string) {
  return /.+@.+\..+/.test(v);
}

function PaymentBox({ amountCents, onSuccess, disabled }: { amountCents: number; onSuccess: (chargedCents: number) => Promise<void> | void; disabled: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePiMetadata = async () => {
    // find PI id from clientSecret on Elements instance
    const clientSecret = (elements as any)?._clientSecret as string | undefined;
    const piId = clientSecret ? clientSecret.split("_secret_")[0] : undefined;
    if (!piId) return;

    const name = (document.querySelector('input[name="donor_name"]') as HTMLInputElement)?.value || "";
    const email = (document.querySelector('input[name="donor_email"]') as HTMLInputElement)?.value || "";
    const githubId = (document.querySelector('input[name="donor_github"]') as HTMLInputElement)?.value || "";
    const message = (document.querySelector('textarea[name="donor_message"]') as HTMLTextAreaElement)?.value || "";
    const publicDonation = (document.querySelector('input[name="donor_public"]') as HTMLInputElement)?.checked ?? true;
    const coverFees = (document.querySelector('input[name="donor_fees"]') as HTMLInputElement)?.checked ?? true;

    await fetch(`/api/stripe/intent`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: piId, receipt_email: email || undefined, metadata: { name, email, githubId, message, publicDonation, coverFees, recurring: false } }),
    });
  };

  const handleDonate = async () => {
    if (disabled) { setError("Enter your name and a valid email to continue."); return; }
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setError(submitErr.message || "Payment form error"); setLoading(false); return; }

    await updatePiMetadata();

    const confirmResult = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${window.location.origin}/success` } });

    if (confirmResult.error) { setError(confirmResult.error.message || "Payment failed"); setLoading(false); return; }

    const paymentIntent = (confirmResult as any).paymentIntent;
    if (paymentIntent) {
      const charged = typeof paymentIntent.amount === "number" ? paymentIntent.amount : amountCents;
      if (paymentIntent.status === "succeeded") {
        await onSuccess(charged);
        await mutate("/api/stats");
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
      }
      router.push(`/success?payment_intent=${paymentIntent.id}`);
    }

    setLoading(false);
  };

  return (
    <div>
      <PaymentElement key={`pe-${amountCents}`} options={{ layout: "tabs" }} />
      {error && <p className="mt-3 text-rose-400 text-sm">{error}</p>}
      <button onClick={handleDonate} disabled={disabled || !stripe || !elements || loading} className="mt-4 focus-ring glass-strong w-full rounded-xl py-3 font-medium">
        {loading ? "Processing…" : `Donate ${currency(amountCents)}`}
      </button>
    </div>
  );
}

export default function DonateControl() {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Form state
  const [amountCents, setAmountCents] = useState(TIERS[1]);
  const [coverFees, setCoverFees] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [githubId, setGithubId] = useState("");
  const [message, setMessage] = useState("");
  const [publicDonation, setPublicDonation] = useState(true);
  const [piError, setPiError] = useState<string | null>(null);
  const [piLoading, setPiLoading] = useState(false);

  const { data: donationData } = useSWR("/api/donations", (u) => fetch(u).then((r) => r.json()), { refreshInterval: 60000 });
  const totalRaisedCents = donationData?.totalRaisedCents ?? 0;

  const emailOk = validEmail(email);
  const readyToPay = name.trim().length > 0 && emailOk;

  useEffect(() => { const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; if (key) setStripePromise(loadStripe(key)); }, []);

  // Only recreate PaymentIntent when pricing changes (amount or coverFees). Debounce to avoid thrash.
  useEffect(() => {
    let t: any;
    const createPI = async () => {
      setPiLoading(true);
      setPiError(null);
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountCents, coverFees, recurring: false }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to create payment intent");
        setClientSecret(json.clientSecret);
      } catch (e: any) {
        setPiError(e.message || "Failed to create payment intent");
        setClientSecret(null);
      } finally { setPiLoading(false); }
    };
    t = setTimeout(createPI, 400);
    return () => clearTimeout(t);
  }, [amountCents, coverFees]);

  if (!stripePromise) return <div className="mt-4 text-slate-400">Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to load Stripe checkout.</div>;

  const showMissing = !readyToPay;

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
          <div className="grid gap-1">
            <label className="text-sm">
              Name <span className="text-rose-400">*</span>
            </label>
            <input name="donor_name" required placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="glass rounded-lg px-3 py-2" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">
              Email <span className="text-rose-400">*</span>
            </label>
            <input name="donor_email" required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass rounded-lg px-3 py-2" />
            {(!emailOk && email.length > 0) ? (<span className="text-xs text-rose-400">Enter a valid email</span>) : null}
          </div>
          <div className="grid gap-1"><label className="text-sm">GitHub ID (username)</label>
            <input name="donor_github" placeholder="e.g. aryan6673" value={githubId} onChange={(e) => setGithubId(e.target.value)} className="glass rounded-lg px-3 py-2" />
          </div>
          <textarea name="donor_message" placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} className="glass rounded-lg px-3 py-2 min-h-20" />
        </div>
      </div>

      <div>
        {piError && <p className="mb-3 text-rose-400 text-sm">{piError}</p>}
        {showMissing && <p className="mb-3 text-amber-400 text-sm">Enter your name and a valid email to continue.</p>}
        {clientSecret ? (
          <Elements key={`el-${clientSecret}`} stripe={stripePromise} options={{ appearance: { theme: "night" }, clientSecret }}>
            <PaymentBox amountCents={amountCents} disabled={piLoading || !clientSecret || showMissing} onSuccess={async (chargedCents) => {
              await fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amountCents: chargedCents }) });
            }} />
          </Elements>
        ) : (
          <div className="text-slate-400">{piLoading ? "Loading payment form…" : "Payment form unavailable"}</div>
        )}

        {/* Total Raised panel */}
        <div className="mt-4 glass rounded-xl p-4 text-sm flex items-center justify-between">
          <span className="text-slate-300">Total raised</span>
          <strong className="text-white">{currency(totalRaisedCents)}</strong>
        </div>
      </div>
    </div>
  );
}
