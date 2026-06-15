import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { LocationCard } from "@/components/cards";
import { TexasMap } from "@/components/TexasMap";
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
          <div className="grid gap-4">
            {locations.map((loc, i) => (
              <Reveal key={loc.slug} delay={i * 0.05}>
                <LocationCard location={loc} />
              </Reveal>
            ))}
          </div>
        </div>
        <p className="mt-8 text-sm text-fg-dim">
          Don&apos;t see your area? It may still be affected — tell us what&apos;s happening near you
          on the <a href="/contact" className="font-semibold text-orange">contact page</a>.
        </p>
      </section>
    </>
  );
}
