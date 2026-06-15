import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { LocationCard } from "@/components/cards";
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
        <div className="grid gap-4 sm:grid-cols-2">
          {locations.map((loc, i) => (
            <Reveal key={loc.slug} delay={i * 0.05}>
              <LocationCard location={loc} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-fg-dim">
          Don&apos;t see your area? It may still be affected — tell us what&apos;s happening near you
          on the <a href="/contact" className="font-semibold text-orange">contact page</a>.
        </p>
      </section>
    </>
  );
}
