export default function WhySupport() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold">Why support?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card title="Keep tools online" desc="Hosting, uptime, and infrastructure for projects many people rely on." />
        <Card title="Fuel new features" desc="Accelerate AI features, accessibility, and performance upgrades." />
        <Card title="Back the community" desc="Sponsor contributors and fund bounties for impactful issues." />
      </div>
    </section>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-400">{desc}</p>
    </div>
  );
}
