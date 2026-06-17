import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/cards";
import { Icon } from "@/components/Icons";
import { locations, getLocation } from "@/content/locations";
import { getArticlesByLocation } from "@/lib/articles";
import { topics } from "@/content/topics";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata(props: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const loc = getLocation(slug);
  if (!loc) return {};
  return {
    title: `Data Centers in ${loc.city}, TX (${loc.county})`,
    description: loc.intro.slice(0, 155),
    alternates: { canonical: `/locations/${slug}` },
  };
}

export default async function LocationHub(props: PageProps<"/locations/[slug]">) {
  const { slug } = await props.params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  const articles = getArticlesByLocation(loc.slug);

  return (
    <>
      <PageHeader
        eyebrow={`${loc.county} · ${loc.region}`}
        title={`Data Centers in ${loc.city}, Texas`}
        intro={loc.intro}
        image={`/images/location-${loc.slug}.jpg`}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <Reveal>
            <Stat label="County" value={loc.county} />
          </Reveal>
          <Reveal delay={0.06}>
            <Stat label="Region" value={loc.region} />
          </Reveal>
          {loc.aquifer && (
            <Reveal delay={0.12}>
              <Stat label="Aquifer at risk" value={loc.aquifer} />
            </Reveal>
          )}
        </div>

        <Reveal className="mt-12">
          <h2 className="text-2xl font-bold text-fg">The harms we&apos;re watching here</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {topics.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.06}>
              <Link
                href={`/damage/${t.slug}`}
                className="flex items-center gap-3 rounded-md border border-line bg-panel p-4 shadow-card hover:border-orange"
              >
                <span className="grid h-10 w-10 place-items-center rounded-sm border border-line bg-panel-2 text-orange">
                  <Icon name={t.icon} width={20} height={20} />
                </span>
                <span className="font-semibold text-fg">{t.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>

        {articles.length > 0 && (
          <>
            <Reveal className="mt-14">
              <h2 className="text-2xl font-bold text-fg">Coverage for {loc.city}</h2>
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 0.06}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </>
        )}

        <div className="cta-band mt-14 flex flex-col items-start gap-4 rounded-md p-8 text-night sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Affected in {loc.city}? Let&apos;s talk.</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-sm bg-night px-5 py-3 font-bold text-paper hover:bg-night/80">
              Free case review
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-sm border border-night/40 px-5 py-3 font-bold text-night"
            >
              <Icon name="phone" width={16} height={16} />
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-panel p-5 shadow-card">
      <div className="eyebrow text-[11px] text-fg-dim">{label}</div>
      <div className="mt-1 text-lg font-bold text-fg">{value}</div>
    </div>
  );
}
