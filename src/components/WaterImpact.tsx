import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import { statewideImpact, formatPeople } from "@/lib/impact";
import { getFacilities, FACILITY_STATUS_META, type FacilityStatus } from "@/lib/facilities";

// The full water-impact analysis block, shown on /locations. All figures come
// from the canonical CARTO-computed dataset (src/content/impact/statewide.json
// via @/lib/impact) so they never drift from the rest of the site. The prose
// scaffolding below (sources, limits, citation) is editorial and lives here.

const url = `${site.url}/locations`;

// Datasets behind the analysis — shown so a reader or journalist can reproduce it.
const sources: { name: string; detail: string; href: string }[] = [
  {
    name: "USGS Public-Supply Water Service Areas (2017)",
    detail:
      "Federal public-domain layer mapping the boundaries of U.S. public water systems and the population each serves. DOI 10.5066/P9I22Z24.",
    href: "https://doi.org/10.5066/P9I22Z24",
  },
  {
    name: "Big Data Damage facility tracker",
    detail:
      "Our source-linked inventory of tracked Texas data centers — every facility placed by coordinate and backed by a public record or news report (listed below).",
    href: "#tracker",
  },
];

// Honest limits — stated up front so the analysis reads as rigorous, not promotional.
const limits: string[] = [
  "Shared supply, not consumption: a facility falling inside a water system's territory means it shares that public supply — it is not a measure of how much water the data center itself draws.",
  "The USGS service-area layer reflects 2017 boundaries; some systems have changed since.",
  "Our tracker is a curated, source-linked inventory of known Texas data centers, not an exhaustive census of every facility in the state.",
  "Population figures are the total served by each water system, not the number of people affected by a data center.",
];

export function WaterImpact() {
  const s = statewideImpact;
  const facilities = getFacilities();

  const updatedLabel = new Date(s.generatedAt + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const stats: { value: string; label: string; source: string }[] = [
    {
      value: String(s.totalDataCenters),
      label: "data centers tracked across Texas",
      source: "Big Data Damage facility tracker — each entry source-linked",
    },
    {
      value: String(s.inWaterDistrict),
      label: "fall inside a mapped public water-supply service area",
      source: "Overlay vs. USGS Public-Supply Water Service Areas (2017)",
    },
    {
      value: String(s.distinctAffectedDistricts),
      label: "public water systems have a tracked data center in their territory",
      source: "Distinct USGS service areas containing ≥1 tracked facility",
    },
    {
      value: formatPeople(s.populationServedByAffectedDistricts),
      label: `Texans are served by those ${s.distinctAffectedDistricts} water systems`,
      source: "Combined USGS population-served figures for those systems",
    },
    {
      value: String(s.notInWaterDistrict),
      label: "sit outside any mapped service area — typically well-reliant land",
      source: "Tracked facilities with no overlapping USGS service area",
    },
  ];

  const exposure: { label: string; value: number; tone: "orange" | "teal" }[] = [
    { label: "Inside a public water-supply service area", value: s.inWaterDistrict, tone: "orange" },
    { label: "Outside any mapped area (private wells / groundwater)", value: s.notInWaterDistrict, tone: "teal" },
  ];
  const exposureTotal = s.inWaterDistrict + s.notInWaterDistrict;

  const statusOrder: FacilityStatus[] = ["operating", "under-construction", "permitted", "proposed"];
  const statusCounts = statusOrder
    .map((status) => ({
      status,
      label: FACILITY_STATUS_META[status].label,
      colorVar: FACILITY_STATUS_META[status].colorVar,
      count: facilities.filter((f) => f.status === status).length,
    }))
    .filter((c) => c.count > 0);
  const statusMax = Math.max(1, ...statusCounts.map((c) => c.count));

  const citation = `Big Data Damage. (2026). Texas Data Center Water Impact Analysis. ${url}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Texas Data Center Water Impact Analysis",
    description:
      "Spatial overlay of tracked Texas data centers against USGS public water-supply service areas, measuring how many fall inside a public water system's territory and the population those systems serve.",
    url,
    creator: { "@type": "Organization", name: site.name, "@id": `${site.url}/#organization` },
    publisher: { "@type": "Organization", name: site.name, "@id": `${site.url}/#organization` },
    dateModified: s.generatedAt,
    license: "https://creativecommons.org/licenses/by/4.0/",
    spatialCoverage: { "@type": "Place", name: "Texas, USA" },
    isBasedOn: "https://doi.org/10.5066/P9I22Z24",
    variableMeasured: [
      "Data centers inside a public water-supply service area",
      "Distinct public water systems containing a data center",
      "Population served by affected water systems",
    ],
  };

  return (
    <div className="mt-8 space-y-8" id="water-impact">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Headline stat band */}
      <Reveal>
        <div className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
          <p className="eyebrow text-[11px] text-hazard">By the numbers</p>
          <h2 className="mt-2 text-xl font-bold text-fg">Data centers and Texas water, measured</h2>
          <p className="mt-1 text-sm text-fg-dim">
            Our original analysis of where Texas data centers land relative to the public water
            systems Texans depend on. Every figure is sourced and reproducible — use it, cite it.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label} className="flex h-full flex-col bg-panel p-5">
                <div className="font-display text-3xl font-bold text-orange sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm font-semibold leading-snug text-fg">{stat.label}</div>
                <div className="mt-2 text-[11px] leading-snug text-fg-dim">{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Water exposure split */}
      <Reveal>
        <div className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
          <h3 className="text-lg font-bold text-fg">
            Where the {exposureTotal} tracked facilities draw their water
          </h3>
          <p className="mt-1 text-sm text-fg-dim">
            Inside a public water system, a facility shares a supply with surrounding homes and farms.
            Outside one, the surrounding land typically relies on private groundwater wells.
          </p>
          <div className="mt-6 space-y-4">
            {exposure.map((e) => (
              <div key={e.label}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold text-fg">{e.label}</span>
                  <span className="font-display font-bold text-hazard">{e.value}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-sm bg-line">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${(e.value / exposureTotal) * 100}%`,
                      background: e.tone === "orange" ? "var(--color-orange)" : "var(--color-teal)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Facilities by status — live from the tracker */}
      {statusCounts.length > 0 && (
        <Reveal>
          <div className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
            <h3 className="text-lg font-bold text-fg">
              The {facilities.length} tracked facilities by status
            </h3>
            <p className="mt-1 text-sm text-fg-dim">
              Updated as our discovery pipeline confirms new public records. See every facility in the
              tracker below.
            </p>
            <div className="mt-6 space-y-4">
              {statusCounts.map((c) => (
                <div key={c.status}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-semibold text-fg">{c.label}</span>
                    <span className="font-display font-bold text-hazard">{c.count}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-sm bg-line">
                    <div
                      className="h-full rounded-sm"
                      style={{ width: `${(c.count / statusMax) * 100}%`, background: c.colorVar }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* How we measured this */}
      <Reveal>
        <div className="rounded-md border border-line bg-panel/60 p-6 shadow-card sm:p-8">
          <p className="eyebrow text-[11px] text-hazard">Methodology</p>
          <h3 className="mt-2 text-lg font-bold text-fg">How we measured this</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg/80">
            We took the coordinates of every data center in our tracker and tested, point-by-point,
            which ones fall inside a mapped public water-supply service area. Population figures are
            the total each affected system reports serving. Analysis last computed {updatedLabel}.
          </p>

          <h4 className="mt-5 text-sm font-bold uppercase tracking-wide text-fg">Sources</h4>
          <ul className="mt-2 space-y-3">
            {sources.map((src) => (
              <li key={src.name} className="text-sm">
                <a
                  href={src.href}
                  {...(src.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="font-semibold text-orange hover:underline"
                >
                  {src.name}
                </a>
                <span className="block text-fg-dim">{src.detail}</span>
              </li>
            ))}
          </ul>

          <h4 className="mt-5 text-sm font-bold uppercase tracking-wide text-fg">
            What these numbers do and don&apos;t mean
          </h4>
          <ul className="mt-2 space-y-2">
            {limits.map((lim) => (
              <li key={lim} className="flex gap-2 text-sm text-fg/80">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-hazard" aria-hidden />
                <span className="leading-snug">{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Cite this */}
      <Reveal>
        <div className="rounded-md border border-orange/40 bg-night p-6 text-paper shadow-card sm:p-8">
          <p className="eyebrow text-[11px] text-hazard">For journalists &amp; researchers</p>
          <h3 className="mt-2 text-lg font-bold">Cite this analysis</h3>
          <p className="mt-2 text-sm text-paper/70">
            Free to cite and republish with attribution
            (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-orange hover:underline">CC BY 4.0</a>).
            Working on a story? Reach us at{" "}
            <a href={site.phoneHref} className="text-orange hover:underline">{site.phone}</a>.
          </p>
          <p className="mt-4 rounded-sm border border-line bg-panel p-4 font-mono text-xs leading-relaxed text-fg">
            {citation}
          </p>
          <p className="mt-3 text-xs text-paper/60">Last updated {updatedLabel}.</p>
        </div>
      </Reveal>
    </div>
  );
}
