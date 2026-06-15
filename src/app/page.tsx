import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { ArticleCard, HarmCard, LocationCard } from "@/components/cards";
import { LeadForm } from "@/components/LeadForm";
import { ByTheNumbers } from "@/components/ByTheNumbers";
import { Icon } from "@/components/Icons";
import { topics } from "@/content/topics";
import { locations } from "@/content/locations";
import { getAllArticles, getFeaturedArticle } from "@/lib/articles";
import { site } from "@/lib/site";

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
                  <span className="inline-flex items-center gap-1 rounded-sm bg-orange px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-night">
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
          {locations.map((loc, i) => (
            <Reveal key={loc.slug} delay={i * 0.05}>
              <LocationCard location={loc} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Lead capture */}
      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">
              Tell us what&apos;s happening
            </p>
            <h2 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">
              They didn&apos;t hit your car. They came for your water, your air, and your home.
            </h2>
            <p className="mt-4 text-fg/70">
              If a data center is affecting your property in Texas, you may have legal options.
              Tell us what you&apos;re seeing near you and we&apos;ll review it — free and confidential.
            </p>
            <a
              href={site.phoneHref}
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-orange px-5 py-3 font-bold text-night transition-colors hover:bg-orange-bright"
            >
              <Icon name="phone" width={16} height={16} />
              Prefer to call? {site.phone}
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <LeadForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
