import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { LegislationCard } from "@/components/cards";
import {
  getLegislation,
  getLegislationByCategory,
  LEGISLATION_CATEGORY_META,
} from "@/lib/legislation";

export const metadata: Metadata = {
  title: "Texas Data Center Legislation Tracker",
  description:
    "Track the Texas bills, statutes, and local ordinances shaping data centers, water, and landowner rights — plain-English summaries, each linked to the official record.",
  alternates: { canonical: "/legislation" },
};

export default function LegislationPage() {
  const groups = getLegislationByCategory();
  const all = getLegislation();

  // schema.org Legislation per entry — helps AI search and rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Texas Data Center Legislation Tracker",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Legislation",
        name: item.title,
        legislationType: LEGISLATION_CATEGORY_META[item.category].label,
        ...(item.billNumber ? { legislationIdentifier: item.billNumber } : {}),
        legislationJurisdiction: item.jurisdiction ?? "Texas",
        ...(item.lastActionDate ? { legislationDate: item.lastActionDate } : {}),
        description: item.summary,
        url: item.sourceUrl,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Law & policy"
        title="Texas data center legislation tracker"
        intro="The Texas bills, statutes, and local ordinances shaping data centers, water, and landowner rights — each summarized in plain English and linked to the official record. We track accountability, not opposition to technology."
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        {groups.length === 0 ? (
          <p className="text-fg-dim">No tracked legislation yet — check back soon.</p>
        ) : (
          <div className="space-y-14">
            {groups.map((group) => (
              <div key={group.category}>
                <Reveal>
                  <h2 className="text-2xl font-bold text-fg sm:text-3xl">
                    {LEGISLATION_CATEGORY_META[group.category].plural}
                  </h2>
                  <p className="mt-1 text-sm text-fg-dim">{group.items.length} tracked</p>
                </Reveal>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item, i) => (
                    <Reveal key={item.slug} delay={(i % 3) * 0.06}>
                      <LegislationCard item={item} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-fg-dim">
          Texas holds regular legislative sessions in odd-numbered years; the next is in 2027.
          During the interim this page tracks enacted laws and local action, and fills in as bills
          are filed. Summaries are our own words, for general information only and not legal advice —
          follow each link for the official record.
        </p>
      </section>
    </>
  );
}
