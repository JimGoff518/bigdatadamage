import { Reveal } from "@/components/Reveal";
import { stats, regions, statsSource } from "@/content/stats";

export function ByTheNumbers() {
  const max = Math.max(...regions.map((r) => r.value));
  const total = regions.reduce((s, r) => s + r.value, 0);

  return (
    <section className="border-y border-line bg-panel/40">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">By the numbers</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-fg sm:text-4xl">
            The scale of the Texas data center rush
          </h2>
        </Reveal>

        {/* Stat band */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="h-full bg-panel p-6">
                <div className="font-display text-4xl font-bold text-orange sm:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm leading-snug text-fg/70">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Region bar chart */}
        <Reveal className="mt-10">
          <div className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
            <h3 className="text-lg font-bold text-fg">
              Where they&apos;re going — {total} planned facilities by region
            </h3>
            <div className="mt-6 space-y-4">
              {regions.map((r) => (
                <div key={r.name}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-fg">{r.name}</span>
                    <span className="font-display font-bold text-hazard">{r.value}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-sm bg-line">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-orange to-hazard"
                      style={{ width: `${(r.value / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-fg-dim">
          <a href={statsSource.href} target="_blank" rel="noopener noreferrer" className="hover:text-orange">
            {statsSource.label}
          </a>
        </p>
      </div>
    </section>
  );
}
