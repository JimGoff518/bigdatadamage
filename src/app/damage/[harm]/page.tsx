import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/cards";
import { Icon } from "@/components/Icons";
import { topics, getTopic } from "@/content/topics";
import { getArticlesByHarm } from "@/lib/articles";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return topics.map((t) => ({ harm: t.slug }));
}

export async function generateMetadata(props: PageProps<"/damage/[harm]">): Promise<Metadata> {
  const { harm } = await props.params;
  const topic = getTopic(harm);
  if (!topic) return {};
  return {
    title: `${topic.name}: ${topic.headline}`,
    description: topic.intro.slice(0, 155),
  };
}

export default async function TopicHub(props: PageProps<"/damage/[harm]">) {
  const { harm } = await props.params;
  const topic = getTopic(harm);
  if (!topic) notFound();

  const articles = getArticlesByHarm(topic.slug);

  return (
    <>
      <PageHeader
        eyebrow={topic.name}
        title={topic.headline}
        intro={topic.intro}
        image={`/images/harm-${topic.slug}.jpg`}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-fg">What&apos;s really going on</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {topic.points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-md border border-line bg-panel p-6 shadow-card">
                <h3 className="text-lg font-bold text-fg">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg/70">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {articles.length > 0 && (
        <section className="border-y border-line bg-panel/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <Reveal>
              <h2 className="text-2xl font-bold text-fg">
                Coverage: {topic.name.toLowerCase()}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 0.06}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="cta-band flex flex-col items-start gap-4 rounded-md p-8 text-night sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Is this happening near your property?</h2>
            <p className="mt-1 font-medium text-night/80">
              You may have legal options. Get a free, confidential review.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-sm bg-night px-5 py-3 font-bold text-paper hover:bg-night/80">
              Tell us what&apos;s happening
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
