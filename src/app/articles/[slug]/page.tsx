import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard, HarmTag, formatDate } from "@/components/cards";
import { LeadForm } from "@/components/LeadForm";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Icon } from "@/components/Icons";
import { parseYouTubeId } from "@/lib/youtube";
import {
  getAllArticles,
  getArticle,
  getRelatedArticles,
  readingMinutes,
  extractToc,
} from "@/lib/articles";
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
  const minutes = readingMinutes(article.content);
  const toc = extractToc(article.content);
  const related = getRelatedArticles(article);

  // Turn a paragraph that is just a bare YouTube link into a lazy video embed.
  const markdownComponents: Components = {
    p({ node, children, ...props }) {
      const kids = (node?.children ?? []).filter(
        (c) => !(c.type === "text" && c.value.trim() === ""),
      );
      const only = kids.length === 1 ? kids[0] : undefined;
      if (only && only.type === "element" && only.tagName === "a") {
        const href = only.properties?.href;
        const vid = typeof href === "string" ? parseYouTubeId(href) : null;
        if (vid) return <VideoEmbed id={vid} title={article.title} />;
      }
      return <p {...props}>{children}</p>;
    },
  };

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
        {/* Byline */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fg-dim">
          <HarmTag harm={article.harm} />
          {location && (
            <Link href={`/locations/${location.slug}`} className="font-semibold text-teal hover:underline">
              {location.city}, TX
            </Link>
          )}
          <time>{formatDate(article.date)}</time>
          <span aria-hidden>·</span>
          <span>{minutes} min read</span>
        </div>

        {/* Featured video */}
        {article.video && (
          <VideoEmbed url={article.video} title={article.title} />
        )}

        {/* Table of contents */}
        {toc.length >= 3 && (
          <nav
            aria-label="In this report"
            className="mt-8 rounded-md border border-line bg-panel p-5 shadow-card"
          >
            <p className="eyebrow text-[11px] text-hazard">In this report</p>
            <ul className="mt-3 space-y-1.5">
              {toc.map((item) => (
                <li key={item.id} className={item.depth === 3 ? "ml-4" : ""}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-fg/80 transition-colors hover:text-orange"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="prose prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:text-fg prose-p:text-fg/90 prose-li:text-fg/90 prose-blockquote:text-fg/80 prose-a:text-orange prose-strong:text-fg">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={markdownComponents}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 rounded-md border border-line bg-panel p-6 text-sm text-fg-dim shadow-card">
          {site.disclaimer}
        </div>
      </article>

      {/* Related coverage */}
      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-fg">
              <Icon name="shield" width={22} height={22} className="text-orange" />
              Related coverage
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead capture */}
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
