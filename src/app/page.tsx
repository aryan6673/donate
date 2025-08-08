import Image from "next/image";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      {/* TODO: Add Why Support, Carousel, Donation UI, Social Proof, Support Wall, Footer */}
      <section id="donate" className="mx-auto max-w-6xl px-6 py-20">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-semibold">Donate</h2>
          <p className="mt-2 text-slate-400">
            Tiers, slider, and Stripe/PayPal checkout coming next.
          </p>
        </div>
      </section>
    </main>
  );
}
