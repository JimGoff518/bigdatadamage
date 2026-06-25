import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { ArticleCard, HarmCard, LocationCard } from "@/components/cards";
import { ByTheNumbers } from "@/components/ByTheNumbers";
import { Icon } from "@/components/Icons";
import { topics } from "@/content/topics";
import { locations } from "@/content/locations";
import { getAllArticles, getFeaturedArticle } from "@/lib/articles";

export const metadata: Metadata = {
  title: {
    absolute: "Big Data Damage — Texas Data Center Water, Air & Property Harm",
  },
  description:
    "Information for Texas landowners near large data centers — how these facilities may affect your water, air, and property value, and what your options are.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const articles = getAllArticles();
  const featured = getFeaturedArticle();
  const latest = articles.filter((a) => a.slug !== featured?.slug).slice(0, 3);

  return (
    <>
      <Hero />

      {/* The three harms */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">The damage</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-fg sm:text-4xl">
            Three ways the data center boom is hurting Texas landowners
          </h2>
          <p className="mt-3 max-w-2xl text-fg/70">
            When a hyperscale facility moves in next door, the burdens can land on you while the
            benefits go elsewhere. Here is where the harm tends to show up.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {topics.map((topic, i) => (
            <Reveal key={topic.slug} delay={i * 0.08}>
              <HarmCard topic={topic} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* By the numbers */}
      <ByTheNumbers />

      {/* Latest articles */}
      <section className="border-y border-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">
                The investigation
              </p>
              <h2 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">
                News &amp; guides for Texas property owners
              </h2>
            </Reveal>
            <Link href="/news" className="inline-flex items-center gap-1 font-semibold text-orange">
              All coverage <Icon name="arrow" width={18} height={18} />
            </Link>
          </div>

          {featured && (
            <Reveal className="mt-10">
              <Link
                href={`/articles/${featured.slug}`}
                className="group grid gap-6 rounded-md border border-line bg-panel p-8 shadow-card transition-colors hover:border-orange/60 md:grid-cols-2 md:items-center"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-sm bg-orange px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-paper">
                    Featured Report
                  </span>
                  <h3 className="mt-4 text-2xl font-bold leading-snug text-fg group-hover:text-orange">
                    {featured.title}
                  </h3>
                  <p className="mt-3 text-fg/70">{featured.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1 font-semibold text-orange">
                    Read the report <Icon name="arrow" width={18} height={18} />
                  </span>
                </div>
                <div className="hidden h-full min-h-44 items-center justify-center rounded-md border border-line bg-panel-2 md:flex">
                  <Icon name="water" width={96} height={96} className="text-teal/40" />
                </div>
              </Link>
            </Reveal>
          )}

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {latest.map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.08}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research & studies */}
      <section className="border-b border-line bg-night text-paper">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">
              Research &amp; studies
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
              The evidence, gathered in one place
            </h2>
            <p className="mt-3 max-w-2xl text-paper/80">
              A curated library of the peer-reviewed studies and agency reports on how data centers
              affect health — noise, diesel emissions, water, and more. Each one links to the full
              text at its source.
            </p>
            <Link
              href="/resources"
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-orange px-5 py-3 font-bold text-paper transition-colors hover:bg-orange-bright"
            >
              Browse the research <Icon name="arrow" width={18} height={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* By location */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">By location</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-fg sm:text-4xl">
            Is a data center near you?
          </h2>
          <p className="mt-3 max-w-2xl text-fg/70">
            We track the Texas communities at the front lines of the data center fight. Find yours.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {locations.slice(0, 6).map((loc, i) => (
            <Reveal key={loc.slug} delay={i * 0.05}>
              <LocationCard location={loc} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 rounded-sm border border-line px-5 py-3 font-semibold text-fg transition-colors hover:border-orange hover:text-orange"
          >
            See all {locations.length} Texas communities we&apos;re tracking
            <Icon name="arrow" width={18} height={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
