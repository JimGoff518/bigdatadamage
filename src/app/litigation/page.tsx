import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { LitigationCard } from "@/components/cards";
import {
  getLitigation,
  getTexasLitigationByCategory,
  getNationalLitigation,
  LITIGATION_CATEGORY_META,
} from "@/lib/litigation";

export const metadata: Metadata = {
  title: "Texas Data Center Litigation Tracker",
  description:
    "Track the lawsuits over data centers in Texas — nuisance and noise, water, zoning, environmental, and utility cases — each summarized in plain English and linked to the public court record.",
  alternates: { canonical: "/litigation" },
};

export default function LitigationPage() {
  const texasGroups = getTexasLitigationByCategory();
  const national = getNationalLitigation();
  const all = getLitigation();

  // schema.org LegalCase-ish ItemList — helps AI search and rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Texas Data Center Litigation Tracker",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LegalCase",
        name: item.caption,
        ...(item.court ? { courtName: item.court } : {}),
        ...(item.filedDate ? { dateCreated: item.filedDate } : {}),
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
        eyebrow="Courts & cases"
        title="Texas data center litigation tracker"
        intro="The lawsuits over data centers and large crypto-mining facilities — noise and nuisance, water, zoning, environmental, and utility cases — each summarized in plain English and linked to the public court record. Texas cases are featured; landmark cases from other states are included for context. We track what the record says, not who ought to win."
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs text-fg-dim">
          Sources: county court dockets, CourtListener, PACER, and public court records. Curated by
          hand — most data-center suits are filed in state court, which no single feed indexes.
        </p>

        {texasGroups.length === 0 && national.length === 0 ? (
          <p className="mt-8 text-fg-dim">No tracked cases yet — check back soon.</p>
        ) : (
          <>
            <div className="mt-10 space-y-14">
              {texasGroups.map((group) => (
                <div key={group.category}>
                  <Reveal>
                    <h2 className="text-2xl font-bold text-fg sm:text-3xl">
                      {LITIGATION_CATEGORY_META[group.category].plural}
                    </h2>
                    <p className="mt-1 text-sm text-fg-dim">
                      {group.items.length} Texas {group.items.length === 1 ? "case" : "cases"}
                    </p>
                  </Reveal>
                  <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item, i) => (
                      <Reveal key={item.slug} delay={(i % 3) * 0.06}>
                        <LitigationCard item={item} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {national.length > 0 && (
              <div className="mt-16 border-t border-line pt-14">
                <Reveal>
                  <h2 className="text-2xl font-bold text-fg sm:text-3xl">
                    National landmark cases
                  </h2>
                  <p className="mt-1 text-sm text-fg-dim">
                    Cases from outside Texas that are shaping how courts handle data-center harm.
                  </p>
                </Reveal>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {national.map((item, i) => (
                    <Reveal key={item.slug} delay={(i % 3) * 0.06}>
                      <LitigationCard item={item} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-fg-dim">
          As of this writing, no Texas lawsuit has yet been filed alleging that a data center
          specifically drained a neighbor&apos;s groundwater or well — the fights so far are over
          noise, permitting, air, and the grid. Summaries are our own words, describe only what the
          filings assert, and are for general information only — not legal advice, and no defendant
          is described as liable before a court has ruled. Follow each link for the public record.
        </p>
      </section>
    </>
  );
}
