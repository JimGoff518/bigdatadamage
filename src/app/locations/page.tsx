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
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div className="rounded-md border border-line bg-panel p-6 shadow-card">
              <p className="eyebrow text-[11px] text-hazard">Hotspot map</p>
              <h2 className="mt-2 text-xl font-bold text-fg">Where the fight is</h2>
              <p className="mt-1 text-sm text-fg-dim">Tap a marker to open that community.</p>
              <div className="mt-4">
                <TexasMap />
              </div>
            </div>
          </Reveal>
          <div className="rounded-md border border-line bg-panel shadow-card">
            <div className="border-b border-line px-5 py-4">
              <p className="eyebrow text-[11px] text-hazard">Communities</p>
              <h2 className="mt-1 text-lg font-bold text-fg">Communities we cover</h2>
              <p className="mt-0.5 text-xs text-fg-dim">
                {locations.length} Texas communities — scroll the list, tap any to open.
              </p>
            </div>
            <ul className="max-h-[26rem] divide-y divide-line overflow-y-auto">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-panel-2"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-fg group-hover:text-orange">
                          {loc.city}
                        </span>
                        {loc.hot && (
                          <span className="rounded-sm bg-orange px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-night">
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
                </li>
              ))}
            </ul>
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
