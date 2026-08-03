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
    // Only surface an image if the file actually exists in /public and isn't a
    // tiny/corrupt stub — a missing image should render as nothing, never broken.
    const imageRef = typeof data.image === "string" ? data.image.trim() : "";
    let image: string | undefined;
    if (imageRef) {
      try {
        const p = path.join(process.cwd(), "public", imageRef);
        if (fs.existsSync(p) && fs.statSync(p).size > 1000) image = imageRef;
      } catch {
        image = undefined;
      }
    }
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
      image,
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

export type Faq = { question: string; answer: string };

// Flatten inline markdown to plain text for JSON-LD answer strings.
function mdToText(md: string): string {
  return md
    .replace(/\r/g, "")
    .trim()
    .replace(/^A[:.]\s*/i, "") // strip a leading "A:" answer marker (Gemini format)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> anchor text
    .replace(/[*_`]/g, "") // emphasis / code ticks
    .replace(/^#{1,6}\s*/gm, "") // stray headings
    .replace(/^>\s?/gm, "") // blockquotes
    .replace(/^[-*]\s+/gm, "") // list bullets
    .replace(/\s+/g, " ")
    .trim();
}

// Pull Q&A pairs out of an article's "Frequently Asked Questions" H2 section so
// the page can emit FAQPage schema. Handles both "### Q: ..." (with a leading
// "A:" answer) and plain "### ..." heading styles.
export function extractFaqs(content: string): Faq[] {
  const lines = content.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+Frequently Asked Questions/i.test(lines[i].trim())) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return [];

  const faqs: Faq[] = [];
  let question: string | null = null;
  let answer: string[] = [];
  const flush = () => {
    if (question) {
      const text = mdToText(answer.join("\n"));
      if (text) faqs.push({ question, answer: text });
    }
  };
  for (let i = start; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^##\s+/.test(t)) break; // next H2 ends the FAQ section
    const h3 = t.match(/^###\s+(.*)$/);
    if (h3) {
      flush();
      question = h3[1].replace(/^Q[:.]\s*/i, "").trim();
      answer = [];
    } else if (question) {
      answer.push(lines[i]);
    }
  }
  flush();
  return faqs;
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
