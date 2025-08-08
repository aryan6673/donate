import Image from "next/image";
import Hero from "@/components/Hero";
import DonateControl from "@/components/DonateControl";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <section id="donate" className="mx-auto max-w-6xl px-6 py-20">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-semibold">Donate</h2>
          <p className="mt-2 text-slate-400">
            Choose a tier or enter a custom amount.
          </p>
          <DonateControl />
        </div>
      </section>
    </main>
  );
}
