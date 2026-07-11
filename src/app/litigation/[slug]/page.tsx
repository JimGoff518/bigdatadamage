import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { HarmTag, formatDate } from "@/components/cards";
import { LifecycleTracker } from "@/components/LifecycleTracker";
import { Icon } from "@/components/Icons";
import { locations } from "@/content/locations";
import {
  getLitigation,
  getLitigationItem,
  getLitigationLifecycle,
  LITIGATION_STATUS_META,
  LITIGATION_CATEGORY_META,
} from "@/lib/litigation";

// The nuisance and water tracks are BDD's intake lane; those pages carry a soft
// consult CTA. Zoning / environmental / utility cases stay informational.
const INTAKE_CATEGORIES = new Set(["nuisance", "water"]);

export function generateStaticParams() {
  return getLitigation().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  props: PageProps<"/litigation/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = getLitigationItem(slug);
  if (!item) return {};
  return {
    title: item.caption,
    description: item.summary.slice(0, 160),
    alternates: { canonical: `/litigation/${slug}` },
  };
}

export default async function LitigationDetailPage(props: PageProps<"/litigation/[slug]">) {
  const { slug } = await props.params;
  const item = getLitigationItem(slug);
  if (!item) notFound();

  const status = LITIGATION_STATUS_META[item.status];
  const category = LITIGATION_CATEGORY_META[item.category];
  const lifecycle = getLitigationLifecycle(item);

  // Cross-link to the /locations page for the same county, when we track one.
  const relatedLocation = item.county
    ? locations.find((l) => l.county === item.county)
    : undefined;

  const showIntake = INTAKE_CATEGORIES.has(item.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalCase",
    name: item.caption,
    ...(item.court ? { courtName: item.court } : {}),
    ...(item.filedDate ? { dateCreated: item.filedDate } : {}),
    description: item.summary,
    url: item.sourceUrl,
  };

  const meta: { label: string; value: string }[] = [
    item.court ? { label: "Court", value: item.court } : null,
    item.docketNumber ? { label: "Docket / cause no.", value: item.docketNumber } : null,
    item.jurisdiction ? { label: "Jurisdiction", value: item.jurisdiction } : null,
    item.filedDate ? { label: "Filed", value: formatDate(item.filedDate) } : null,
    item.plaintiffs ? { label: "Plaintiffs", value: item.plaintiffs } : null,
    item.defendants ? { label: "Defendants", value: item.defendants } : null,
    item.operator ? { label: "Operator", value: item.operator } : null,
    item.reliefSought ? { label: "Relief sought", value: item.reliefSought } : null,
  ].filter((r): r is { label: string; value: string } => r !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader eyebrow={category.label} title={item.caption} />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/litigation"
          className="inline-flex items-center gap-1 text-sm font-semibold text-orange"
        >
          <Icon name="arrow" width={14} height={14} className="rotate-180" /> All cases
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-paper"
            style={{ backgroundColor: status.colorVar }}
          >
            {status.label}
          </span>
          <span className="text-xs font-semibold text-fg-dim">
            {category.label}
            {item.county ? ` · ${item.county}` : ""}
          </span>
        </div>

        {/* The lifecycle tracker — the centerpiece. */}
        <div className="mt-8 rounded-md border border-line bg-panel p-6 shadow-card">
          <p className="eyebrow text-[11px] text-hazard">Where it stands</p>
          <h2 className="mt-1 text-xl font-bold text-fg">Case lifecycle</h2>
          <div className="mt-7">
            <LifecycleTracker
              lifecycle={lifecycle}
              stageDates={item.stageDates}
              stageNote={item.stageNote}
              variant="detail"
              ariaLabel="Case progress"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-fg">What the case is about</h2>
          <p className="mt-2 leading-relaxed text-fg/80">{item.summary}</p>
        </div>

        {item.whyItMatters && (
          <div className="mt-6 rounded-md border-l-4 border-orange bg-panel-2/40 p-4">
            <p className="text-sm font-semibold text-fg">Why it matters</p>
            <p className="mt-1 leading-relaxed text-fg/75">{item.whyItMatters}</p>
          </div>
        )}

        {meta.length > 0 && (
          <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-line pt-6 sm:grid-cols-2">
            {meta.map((row) => (
              <div key={row.label}>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-fg-dim">
                  {row.label}
                </dt>
                <dd className="mt-0.5 text-sm text-fg/85">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {item.harm && item.harm.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {item.harm.map((h) => (
              <HarmTag key={h} harm={h} />
            ))}
          </div>
        )}

        {relatedLocation && (
          <div className="mt-8">
            <Link
              href={`/locations/${relatedLocation.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange"
            >
              See data centers &amp; water in {relatedLocation.county} ({relatedLocation.city}){" "}
              <Icon name="arrow" width={16} height={16} />
            </Link>
          </div>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange"
          >
            View the source{item.sourceName ? ` (${item.sourceName})` : ""}{" "}
            <Icon name="arrow" width={16} height={16} />
          </a>
          {item.docketUrl && (
            <div className="mt-2">
              <a
                href={item.docketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange"
              >
                View the docket <Icon name="arrow" width={16} height={16} />
              </a>
            </div>
          )}
          {item.lastAction && (
            <p className="mt-3 text-xs text-fg-dim">
              Last action: {item.lastAction}
              {item.lastActionDate ? ` · ${formatDate(item.lastActionDate)}` : ""}
            </p>
          )}
        </div>

        {showIntake && (
          <div className="mt-10 rounded-md border border-orange/40 bg-panel-2/40 p-6">
            <p className="text-lg font-bold text-fg">Facing similar harm on your land?</p>
            <p className="mt-2 text-sm leading-relaxed text-fg/75">
              If a data center or crypto mine is affecting the use and quiet enjoyment of your
              Texas property, you may have options. Talk to a Texas attorney about your specific
              situation — this is not about joining the case above.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-sm bg-orange px-4 py-2 text-sm font-bold text-paper transition-colors hover:bg-orange-bright"
            >
              Request a free consultation <Icon name="arrow" width={16} height={16} />
            </Link>
          </div>
        )}

        <p className="mt-8 text-xs leading-relaxed text-fg-dim">
          Summary is our own words and describes only what the public filings assert. Nothing here
          characterizes the merits or predicts an outcome, and no party is described as liable
          before a court has ruled. This is general information, not legal advice. Follow the links
          above for the public record.
        </p>
      </section>
    </>
  );
}
