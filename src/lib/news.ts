// External news headlines pulled from Google News RSS search feeds.
//
// We aggregate a few focused queries (water, air/noise/property, litigation,
// transmission-line / eminent-domain, and named Texas hotspots), merge and
// de-duplicate the results, and surface the most recent headlines that link
// out to the original publishers. We only display title + source + date +
// outbound link — never republished article text — and cache for six hours.
//
// Note: Google News RSS is unofficial; format can change. All network calls
// are wrapped so a failure degrades to an empty list rather than an error.

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  isoDate: string; // ISO; empty string if unknown
};

// Each entry becomes one Google News RSS search feed. Keep these tied to
// landowner-harm angles so the feed stays on-topic.
const QUERIES: string[] = [
  '"data center" Texas (water OR aquifer OR groundwater OR drought OR well)',
  '"data center" Texas (noise OR emissions OR "property value" OR pollution)',
  'Texas (data center OR "crypto mining") (lawsuit OR "class action" OR moratorium OR TCEQ OR permit)',
  '(Oncor OR CenterPoint) (eminent domain OR easement OR "transmission line") Texas',
  '("data center" OR "crypto mine") (Granbury OR "Hood County" OR "Sulphur Springs" OR "Hopkins County" OR "Hill County" OR Hillsboro OR Amarillo OR "Corpus Christi" OR Harlingen OR Temple OR "San Marcos" OR Lufkin OR Sweetwater OR Odessa)',
];

function feedUrl(query: string): string {
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([^]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function tagText(block: string, name: string): string {
  const m = new RegExp(`<${name}[^>]*>([^]*?)</${name}>`, "i").exec(block);
  return m ? decodeEntities(m[1]) : "";
}

function parseItems(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item>([^]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const rawTitle = tagText(block, "title");
    const link = tagText(block, "link");
    const source = tagText(block, "source");
    const pubDate = tagText(block, "pubDate");
    if (!rawTitle || !link) continue;

    // Google News appends " - Source" to the title; strip it when we know the source.
    let title = rawTitle;
    if (source && title.endsWith(` - ${source}`)) {
      title = title.slice(0, -1 * ` - ${source}`.length).trim();
    }

    let isoDate = "";
    if (pubDate) {
      const d = new Date(pubDate);
      if (!Number.isNaN(d.getTime())) isoDate = d.toISOString();
    }

    items.push({ title, link, source: source || "Google News", isoDate });
  }
  return items;
}

async function fetchFeed(query: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(feedUrl(query), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BigDataDamageBot/1.0)" },
      // Cache at the Next data layer; refresh every six hours.
      next: { revalidate: 21600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseItems(xml);
  } catch {
    return [];
  }
}

function normalizeKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Aggregate all query feeds, de-duplicate by headline, and return the most
 * recent items. Always resolves (never throws) so the page renders even when
 * Google News is unreachable.
 */
export async function getDataCenterNews(limit = 12): Promise<NewsItem[]> {
  const results = await Promise.all(QUERIES.map(fetchFeed));
  const seen = new Set<string>();
  const merged: NewsItem[] = [];
  for (const item of results.flat()) {
    const key = normalizeKey(item.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  merged.sort((a, b) => (a.isoDate < b.isoDate ? 1 : a.isoDate > b.isoDate ? -1 : 0));
  return merged.slice(0, limit);
}
