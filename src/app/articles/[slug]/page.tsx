import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageHeader } from "@/components/PageHeader";
import { HarmTag, formatDate } from "@/components/cards";
import { LeadForm } from "@/components/LeadForm";
import { getAllArticles, getArticle } from "@/lib/articles";
import { getLocation } from "@/content/locations";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const location = article.location ? getLocation(article.location) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader title={article.title} />

      <article className="mx-auto max-w-3xl px-4 py-14">
        <div className="flex flex-wrap items-center gap-3 text-sm text-fg-dim">
          <HarmTag harm={article.harm} />
          {location && (
            <Link href={`/locations/${location.slug}`} className="font-semibold text-teal hover:underline">
              {location.city}, TX
            </Link>
          )}
          <time>{formatDate(article.date)}</time>
        </div>

        <div className="prose prose-invert prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:text-fg prose-a:text-orange prose-strong:text-fg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        <div className="mt-12 rounded-md border border-line bg-panel p-6 text-sm text-fg-dim shadow-card">
          {site.disclaimer}
        </div>
      </article>

      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-2xl font-bold text-fg">
            Affected by this? Tell us what&apos;s happening near you.
          </h2>
          <p className="mt-2 text-fg/70">
            A free, confidential review — or call{" "}
            <a href={site.phoneHref} className="font-semibold text-orange">{site.phone}</a>.
          </p>
          <div className="mt-6">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
