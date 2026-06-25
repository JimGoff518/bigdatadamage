import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icons";
import { TexasMap } from "@/components/TexasMap";
import { FacilityList } from "@/components/FacilityList";
import { locations } from "@/content/locations";

export const metadata: Metadata = {
  title: "Texas Data Center Hotspots by Location",
  description:
    "Find your Texas community on the front lines of the data center fight — water, air, and property-value impacts by city, county, and aquifer.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="By location"
        title="Is a data center near you?"
        intro="We're tracking the Texas cities, counties, and aquifers where data centers are hitting landowners hardest. Find yours."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="rounded-md border border-line bg-panel p-6 shadow-card">
            <p className="eyebrow text-[11px] text-hazard">Hotspot map</p>
            <h2 className="mt-2 text-xl font-bold text-fg">Where the fight is</h2>
            <p className="mt-1 text-sm text-fg-dim">Tap a marker to open that community.</p>
            <div className="mx-auto mt-4 max-w-2xl">
              <TexasMap />
            </div>
          </div>
        </Reveal>

        {/* Communities — below the map */}
        <div className="mt-10">
          <p className="eyebrow text-[11px] text-hazard">Communities</p>
          <h2 className="mt-1 text-xl font-bold text-fg">Communities we cover</h2>
          <p className="mt-1 text-sm text-fg-dim">
            {locations.length} Texas communities on the front lines — tap any to open.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="group flex items-center justify-between gap-3 rounded-md border border-line bg-panel px-4 py-3 shadow-card transition-colors hover:border-orange"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-fg group-hover:text-orange">{loc.city}</span>
                    {loc.hot && (
                      <span className="rounded-sm bg-orange px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
                        Hotspot
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-fg-dim">
                    {loc.county}
                    {loc.aquifer ? ` · ${loc.aquifer}` : ""}
                  </span>
                </span>
                <Icon name="arrow" width={16} height={16} className="shrink-0 text-orange" />
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-8 text-sm text-fg-dim">
          Don&apos;t see your area? It may still be affected — tell us what&apos;s happening near you
          on the <a href="/contact" className="font-semibold text-orange">contact page</a>.
        </p>
      </section>

      <FacilityList />
    </>
  );
}
