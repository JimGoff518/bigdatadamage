import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/cards";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "News & Guides on Texas Data Centers",
  description:
    "The latest news, lawsuit information, and plain-English guides on data center water, air, and property impacts across Texas.",
};

export default function NewsPage() {
  const articles = getAllArticles();

  return (
    <>
      <PageHeader
        eyebrow="News & guides"
        title="Tracking the Texas data center fight"
        intro="Lawsuit information, local updates, and plain-English guides for property owners. New coverage added regularly."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        {articles.length === 0 ? (
          <p className="text-fg-dim">Coverage is on the way. Check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.06}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
