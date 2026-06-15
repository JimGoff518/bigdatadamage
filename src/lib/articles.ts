import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  harm?: string; // topic slug
  location?: string; // location slug
  featured?: boolean;
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
