import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/cards";
import { NewsFeed } from "@/components/NewsFeed";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "News & Guides on Texas Data Centers",
  description:
    "The latest news, lawsuit information, and plain-English guides on data center water, air, and property impacts across Texas.",
};

// Refresh the aggregated headline feed every six hours.
export const revalidate = 21600;

export default function NewsPage() {
  const articles = getAllArticles();

  return (
    <>
      <PageHeader
        eyebrow="News & guides"
        title="Tracking the Texas data center fight"
        intro="Lawsuit information, local updates, and plain-English guides for property owners. New coverage added regularly."
      />

      {articles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-8">
          <Reveal>
            <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">Our coverage</p>
            <h2 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">Guides &amp; reports</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.06}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Aggregated external headlines — outbound links only, no republished text. */}
      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">
              From around Texas
            </p>
            <h2 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">Latest headlines</h2>
            <p className="mt-3 max-w-2xl text-fg/70">
              Recent reporting on Texas data centers, water and power impacts, and transmission-line
              and eminent-domain fights. Links open the original article at the source.
            </p>
          </Reveal>
          <div className="mt-8">
            <Suspense fallback={<p className="text-sm text-fg-dim">Loading the latest headlines…</p>}>
              <NewsFeed />
            </Suspense>
          </div>
          <p className="mt-6 text-xs text-fg-dim">
            Headlines aggregated via Google News. Big Data Damage is not affiliated with the linked
            outlets, and links lead to third-party sites we don&apos;t control.
          </p>
        </div>
      </section>
    </>
  );
}
