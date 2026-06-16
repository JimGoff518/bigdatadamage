import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  harm?: string; // topic slug
  location?: string; // location slug
  featured?: boolean;
  video?: string; // optional featured YouTube URL/id, shown atop the article
  image?: string; // optional hero/social image, root-relative path under /public
  seoTitle?: string;
  seoDescription?: string;
  content: string; // markdown body
};

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      date: data.date ? new Date(data.date).toISOString() : new Date(0).toISOString(),
      author: data.author ?? "Big Data Damage",
      harm: data.harm,
      location: data.location,
      featured: data.featured ?? false,
      video: data.video,
      image: data.image,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      content,
    } satisfies Article;
  });
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByHarm(harm: string): Article[] {
  return getAllArticles().filter((a) => a.harm === harm);
}

export function getArticlesByLocation(location: string): Article[] {
  return getAllArticles().filter((a) => a.location === location);
}

export function getFeaturedArticle(): Article | undefined {
  const all = getAllArticles();
  return all.find((a) => a.featured) ?? all[0];
}

export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type TocItem = { depth: 2 | 3; text: string; id: string };

// Extract h2/h3 headings; slugs match rehype-slug (both use github-slugger in doc order).
export function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  for (const raw of content.split("\n")) {
    const m = /^(#{2,3})\s+(.+)$/.exec(raw.trim());
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    const text = m[2].replace(/[*_`]/g, "").trim();
    items.push({ depth, text, id: slugger.slug(text) });
  }
  return items;
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const others = getAllArticles().filter((a) => a.slug !== article.slug);
  const scored = others
    .map((a) => {
      let score = 0;
      if (article.harm && a.harm === article.harm) score += 2;
      if (article.location && a.location === article.location) score += 3;
      return { a, score };
    })
    .sort((x, y) => y.score - x.score || (x.a.date < y.a.date ? 1 : -1));
  return scored.slice(0, limit).map((x) => x.a);
}
