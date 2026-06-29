import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import { getFacilities, FACILITY_STATUS_META, type FacilityStatus } from "@/lib/facilities";
import {
  waterImpactStats,
  waterExposure,
  waterImpactSources,
  waterImpactLimits,
  waterImpactCitation,
  waterImpactUpdated,
} from "@/content/water-impact";

const url = `${site.url}/water-impact`;
const updatedLabel = new Date(waterImpactUpdated + "T00:00:00Z").toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export const metadata: Metadata = {
  title: "Texas Data Center Water Impact — The Data",
  description:
    "Original analysis: 56 of 79 tracked Texas data centers sit inside a public water-supply service area, across 13 systems serving 5.25 million Texans. Sources and methodology included.",
  alternates: { canonical: "/water-impact" },
};

export default function WaterImpactPage() {
  const facilities = getFacilities();

  // Facilities-by-status, computed live from the tracker so the chart can never
  // drift from the data behind the map.
  const statusOrder: FacilityStatus[] = ["operating", "under-construction", "permitted", "proposed"];
  const statusCounts = statusOrder
    .map((status) => ({
      status,
      label: FACILITY_STATUS_META[status].label,
      colorVar: FACILITY_STATUS_META[status].colorVar,
      count: facilities.filter((f) => f.status === status).length,
    }))
    .filter((s) => s.count > 0);
  const statusMax = Math.max(1, ...statusCounts.map((s) => s.count));

  const exposureTotal = waterExposure.reduce((sum, e) => sum + e.value, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: "Texas Data Center Water Impact Analysis",
        description:
          "Spatial overlay of tracked Texas data centers against USGS public water-supply service areas, measuring how many fall inside a public water system's territory and the population those systems serve.",
        url,
        creator: { "@type": "Organization", name: site.name, "@id": `${site.url}/#organization` },
        publisher: { "@type": "Organization", name: site.name, "@id": `${site.url}/#organization` },
        dateModified: waterImpactUpdated,
        license: "https://creativecommons.org/licenses/by/4.0/",
        spatialCoverage: { "@type": "Place", name: "Texas, USA" },
        isBasedOn: "https://doi.org/10.5066/P9I22Z24",
        variableMeasured: [
          "Data centers inside a public water-supply service area",
          "Distinct public water systems containing a data center",
          "Population served by affected water systems",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Water Impact", item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHeader
        eyebrow="The data"
        title="Texas Data Center Water Impact"
        intro="Our original analysis of where Texas data centers land relative to the public water systems Texans depend on. Every figure below is sourced and reproducible — use it, cite it."
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        {/* Headline stat band */}
        <Reveal>
          <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">By the numbers</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold text-fg sm:text-3xl">
            What the overlay shows
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-5">
          {waterImpactStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="flex h-full flex-col bg-panel p-5">
                <div className="font-display text-4xl font-bold text-orange">{s.value}</div>
                <div className="mt-2 text-sm font-semibold leading-snug text-fg">{s.label}</div>
                <div className="mt-2 text-[11px] leading-snug text-fg-dim">{s.source}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Water exposure split */}
        <Reveal className="mt-12">
          <div className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
            <h3 className="text-lg font-bold text-fg">
              Where the {exposureTotal} tracked facilities draw their water
            </h3>
            <p className="mt-1 text-sm text-fg-dim">
              Inside a public water system, the facility shares a supply with surrounding homes and
              farms. Outside one, the surrounding land typically relies on private groundwater wells.
            </p>
            <div className="mt-6 space-y-4">
              {waterExposure.map((e) => (
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
                        background:
                          e.tone === "orange"
                            ? "var(--color-orange)"
                            : "var(--color-teal)",
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
          <Reveal className="mt-8">
            <div className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
              <h3 className="text-lg font-bold text-fg">
                The {facilities.length} tracked facilities by status
              </h3>
              <p className="mt-1 text-sm text-fg-dim">
                Updated continuously as our discovery pipeline confirms new public records.
              </p>
              <div className="mt-6 space-y-4">
                {statusCounts.map((s) => (
                  <div key={s.status}>
                    <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-semibold text-fg">{s.label}</span>
                      <span className="font-display font-bold text-hazard">{s.count}</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-sm bg-line">
                      <div
                        className="h-full rounded-sm"
                        style={{ width: `${(s.count / statusMax) * 100}%`, background: s.colorVar }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-fg-dim">
                Explore each facility on the{" "}
                <Link href="/locations" className="font-semibold text-orange hover:underline">
                  interactive hotspot map
                </Link>
                .
              </p>
            </div>
          </Reveal>
        )}

        {/* How we measured this */}
        <Reveal className="mt-12">
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
              {waterImpactSources.map((src) => (
                <li key={src.name} className="text-sm">
                  {src.href.startsWith("http") ? (
                    <a
                      href={src.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-orange hover:underline"
                    >
                      {src.name}
                    </a>
                  ) : (
                    <Link href={src.href} className="font-semibold text-orange hover:underline">
                      {src.name}
                    </Link>
                  )}
                  <span className="block text-fg-dim">{src.detail}</span>
                </li>
              ))}
            </ul>

            <h4 className="mt-5 text-sm font-bold uppercase tracking-wide text-fg">
              What these numbers do and don&apos;t mean
            </h4>
            <ul className="mt-2 space-y-2">
              {waterImpactLimits.map((lim) => (
                <li key={lim} className="flex gap-2 text-sm text-fg/80">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-hazard" aria-hidden />
                  <span className="leading-snug">{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Cite this page */}
        <Reveal className="mt-8">
          <div className="rounded-md border border-orange/40 bg-night p-6 text-paper shadow-card sm:p-8">
            <p className="eyebrow text-[11px] text-hazard">For journalists &amp; researchers</p>
            <h3 className="mt-2 text-lg font-bold">Cite this page</h3>
            <p className="mt-2 text-sm text-paper/70">
              This analysis is free to cite and republish with attribution
              (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-orange hover:underline">CC BY 4.0</a>).
              Working on a story? Reach us at{" "}
              <a href={site.phoneHref} className="text-orange hover:underline">{site.phone}</a>.
            </p>
            <p className="mt-4 rounded-sm border border-line bg-panel p-4 font-mono text-xs leading-relaxed text-fg">
              {waterImpactCitation}
            </p>
            <p className="mt-3 text-xs text-paper/60">Last updated {updatedLabel}.</p>
          </div>
        </Reveal>

        {/* Related */}
        <Reveal className="mt-8">
          <p className="text-sm text-fg-dim">
            Related:{" "}
            <Link href="/locations" className="font-semibold text-orange hover:underline">the hotspot map</Link>,{" "}
            <Link href="/resources" className="font-semibold text-orange hover:underline">the studies library</Link>, and{" "}
            <Link href="/damage" className="font-semibold text-orange hover:underline">how data centers harm Texas landowners</Link>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
