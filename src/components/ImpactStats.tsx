import { statewideImpact, formatPeople } from "@/lib/impact";

// Statewide data-center / water-exposure figures, computed in CARTO from
// public-domain USGS + Census data. Each stat is labeled (color is never the
// only cue) and the source/date line makes the provenance explicit.
export function ImpactStats() {
  const s = statewideImpact;
  const stats: { value: string; label: string; emphasis?: boolean }[] = [
    { value: String(s.totalDataCenters), label: "Texas data centers tracked" },
    {
      value: String(s.inWaterDistrict),
      label: "sit inside a public water-supply district",
      emphasis: true,
    },
    {
      value: formatPeople(s.populationServedByAffectedDistricts),
      label: `people served by those ${s.distinctAffectedDistricts} districts`,
      emphasis: true,
    },
    {
      value: String(s.notInWaterDistrict),
      label: "are on private wells or no public system",
    },
  ];

  return (
    <section
      aria-label="Texas data center water-exposure figures"
      className="rounded-md border border-line bg-panel p-6 shadow-card"
    >
      <p className="eyebrow text-[11px] text-hazard">By the numbers</p>
      <h2 className="mt-2 text-xl font-bold text-fg">
        Data centers and Texas water, measured
      </h2>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span
                className={`block text-3xl font-bold tabular-nums sm:text-4xl ${
                  stat.emphasis ? "text-orange" : "text-fg"
                }`}
              >
                {stat.value}
              </span>
              <span className="mt-1 block text-sm text-fg-dim">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-xs text-fg-dim">
        As of {s.generatedAt}. {s.source}
      </p>
    </section>
  );
}
