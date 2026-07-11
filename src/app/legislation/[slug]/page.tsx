import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { HarmTag, formatDate } from "@/components/cards";
import { LifecycleTracker } from "@/components/LifecycleTracker";
import { Icon } from "@/components/Icons";
import {
  getLegislation,
  getLegislationItem,
  getLifecycle,
  HEARING_VIDEO,
  LEGISLATION_STATUS_META,
  LEGISLATION_CATEGORY_META,
} from "@/lib/legislation";

export function generateStaticParams() {
  return getLegislation().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  props: PageProps<"/legislation/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = getLegislationItem(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary.slice(0, 160),
    alternates: { canonical: `/legislation/${slug}` },
  };
}

export default async function LegislationDetailPage(props: PageProps<"/legislation/[slug]">) {
  const { slug } = await props.params;
  const item = getLegislationItem(slug);
  if (!item) notFound();

  const status = LEGISLATION_STATUS_META[item.status];
  const category = LEGISLATION_CATEGORY_META[item.category];

  // Compute the lifecycle here so the tracker stays domain-agnostic. When a
  // bill sits in committee, offer the live hearing video as the tracker footer.
  const lifecycle = getLifecycle(item);
  const currentStage = lifecycle.track[lifecycle.currentIndex];
  const inCommittee = !lifecycle.terminal && currentStage.key === "committee";
  const hearingFooter = inCommittee ? (
    <div className="mt-6">
      {item.chamber === "senate" || item.chamber === "house" ? (
        <a
          href={HEARING_VIDEO[item.chamber]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm bg-orange px-4 py-2 text-sm font-bold text-paper transition-colors hover:bg-orange-bright"
        >
          ▶ Watch the {item.chamber === "senate" ? "Senate" : "House"} hearing
        </a>
      ) : (
        <p className="text-sm text-fg/70">
          Watch live committee testimony:{" "}
          <a
            href={HEARING_VIDEO.house}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange underline"
          >
            House
          </a>
          {" · "}
          <a
            href={HEARING_VIDEO.senate}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange underline"
          >
            Senate
          </a>
        </p>
      )}
    </div>
  ) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: item.title,
    legislationType: category.label,
    ...(item.billNumber ? { legislationIdentifier: item.billNumber } : {}),
    legislationJurisdiction: item.jurisdiction ?? "Texas",
    ...(item.lastActionDate ? { legislationDate: item.lastActionDate } : {}),
    description: item.summary,
    url: item.sourceUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader eyebrow={category.label} title={item.title} />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/legislation"
          className="inline-flex items-center gap-1 text-sm font-semibold text-orange"
        >
          <Icon name="arrow" width={14} height={14} className="rotate-180" /> All legislation
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-paper"
            style={{ backgroundColor: status.colorVar }}
          >
            {status.label}
          </span>
          <span className="text-xs font-semibold text-fg-dim">
            {item.billNumber
              ? `${item.billNumber}${item.session ? ` · ${item.session}` : ""}`
              : item.jurisdiction}
            {item.chamber ? ` · ${item.chamber === "house" ? "House" : "Senate"}` : ""}
          </span>
        </div>

        {/* The lifecycle tracker — the centerpiece. */}
        <div className="mt-8 rounded-md border border-line bg-panel p-6 shadow-card">
          <p className="eyebrow text-[11px] text-hazard">Where it stands</p>
          <h2 className="mt-1 text-xl font-bold text-fg">Lifecycle</h2>
          <div className="mt-7">
            <LifecycleTracker
              lifecycle={lifecycle}
              stageDates={item.stageDates}
              stageNote={item.stageNote}
              variant="detail"
              ariaLabel="Legislative progress"
              footer={hearingFooter}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-fg">What it does</h2>
          <p className="mt-2 leading-relaxed text-fg/80">{item.summary}</p>
        </div>

        {item.whyItMatters && (
          <div className="mt-6 rounded-md border-l-4 border-orange bg-panel-2/40 p-4">
            <p className="text-sm font-semibold text-fg">Why it matters</p>
            <p className="mt-1 leading-relaxed text-fg/75">{item.whyItMatters}</p>
          </div>
        )}

        {item.harm && item.harm.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {item.harm.map((h) => (
              <HarmTag key={h} harm={h} />
            ))}
          </div>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange"
          >
            View the official record{item.sourceName ? ` (${item.sourceName})` : ""}{" "}
            <Icon name="arrow" width={16} height={16} />
          </a>
          {item.lastAction && (
            <p className="mt-2 text-xs text-fg-dim">
              Last action: {item.lastAction}
              {item.lastActionDate ? ` · ${formatDate(item.lastActionDate)}` : ""}
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-fg-dim">
            Summary is our own words, for general information only and not legal advice. The stages
            shown reflect the standard Texas legislative process; follow the link above for the
            official record.
          </p>
        </div>
      </section>
    </>
  );
}
