// Parse a YouTube video ID from a raw ID or any common YouTube URL shape.
// Returns null when the input isn't a recognizable YouTube reference.
export function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const s = input.trim();

  // Already a bare 11-char video id.
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, "");

  // youtu.be/<id>
  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  }

  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    // watch?v=<id>
    const v = u.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    // /embed/<id>, /shorts/<id>, /v/<id>
    const m = u.pathname.match(/\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }

  return null;
}

// Static thumbnail for the facade. hqdefault always exists for valid ids.
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// ===========================================================================
// Featured video for the news section.
//
// Picks the newest ON-TOPIC YouTube video via the YouTube Data API v3, then
// applies STRICT quality gates so this attorney-sponsored page never auto-
// features an amateur, off-brand, or irrelevant clip. Selection order:
//   1. PINNED_VIDEO (manual override) — always wins if set.
//   2. Newest live result that passes ALL quality gates.
//   3. FALLBACK_VIDEO (hand-picked evergreen) — if no key / no qualifying result.
//
// Cached at the Next data layer and refreshed daily, so "latest video" updates
// automatically without a rebuild.
//
// SETUP: set YOUTUBE_API_KEY (YouTube Data API v3) in the environment (Vercel
// project env + local .env.local). Free tier = 10,000 units/day; our daily
// check costs ~200-300. Without the key, FALLBACK_VIDEO shows.
// ===========================================================================

export type FeaturedVideo = {
  id: string; // YouTube video id
  title: string;
  channel: string;
  publishedAt: string; // ISO 8601; empty if unknown
  url: string; // canonical watch URL (outbound link)
};

// Always-win override. Set `id` (+ title/channel) to pin a specific video
// regardless of the live search. Leave null to let auto-selection run.
const PINNED_VIDEO: FeaturedVideo | null = null;

// Shown when the API key is missing, the request fails, or nothing passes the
// quality filter. Keep this a strong, credible, evergreen clip. Swap any time.
const FALLBACK_VIDEO: FeaturedVideo = {
  id: "fp5ozQraKf4",
  title: "Nationwide boom in AI data centers stirs resistance",
  channel: "CBS Sunday Morning",
  publishedAt: "",
  url: "https://www.youtube.com/watch?v=fp5ozQraKf4",
};

// order=date searches; our filters then enforce relevance + quality.
const VIDEO_QUERIES: string[] = [
  "Texas data center water landowner",
  "Texas data center power grid community",
  "data center Texas opposition lawsuit",
];

// A candidate must mention the topic AND a Texas/landowner angle.
const TOPIC_TERMS = ["data center", "data centre", "datacenter", "data-center"];
const TEXAS_TERMS = [
  "texas",
  "ercot",
  "landowner",
  "rancher",
  "ranch",
  "aquifer",
  "groundwater",
  "well water",
  "hood county",
  "sulphur springs",
  "hopkins county",
  "hill county",
  "panhandle",
  "lone star",
];

// Hard-reject obvious off-topic noise even if a keyword coincidentally appears.
const BLOCK_TERMS = [
  "minecraft",
  "tier list",
  "build a pc",
  "gaming",
  "crypto giveaway",
  "price prediction",
  "stock to buy",
];

// Channel ids we always trust (bypass the view floor). Add reputable outlets'
// channel ids here as you find them.
const TRUSTED_CHANNELS = new Set<string>([]);

const MIN_VIEWS = 1000; // amateur-upload floor
const MIN_DURATION_SEC = 75; // excludes Shorts (<=60s) and throwaway clips
const MAX_AGE_DAYS = 120; // don't surface a months-stale clip as "latest"

type Candidate = {
  id: string;
  title: string;
  description: string;
  channel: string;
  channelId: string;
  publishedAt: string;
  url: string;
  views: number;
  durationSec: number;
};

function hasAny(haystack: string, terms: string[]): boolean {
  const h = haystack.toLowerCase();
  return terms.some((t) => h.includes(t));
}

// Parse ISO 8601 duration (e.g. "PT5M30S") to seconds.
function parseDuration(iso: string): number {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
  if (!m) return 0;
  return (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0);
}

async function searchVideoIds(key: string): Promise<string[]> {
  const ids = new Set<string>();
  await Promise.all(
    VIDEO_QUERIES.map(async (q) => {
      try {
        const url =
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video` +
          `&order=date&maxResults=10&videoEmbeddable=true&relevanceLanguage=en` +
          `&q=${encodeURIComponent(q)}&key=${key}`;
        const res = await fetch(url, { next: { revalidate: 86400 } });
        if (!res.ok) return;
        const data = (await res.json()) as { items?: { id?: { videoId?: string } }[] };
        for (const item of data.items ?? []) {
          const vid = item.id?.videoId;
          if (vid) ids.add(vid);
        }
      } catch {
        /* ignore a single failed query */
      }
    }),
  );
  return [...ids];
}

async function hydrate(key: string, ids: string[]): Promise<Candidate[]> {
  if (ids.length === 0) return [];
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics` +
      `&id=${ids.join(",")}&key=${key}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items?: {
        id?: string;
        snippet?: { title?: string; description?: string; channelTitle?: string; channelId?: string; publishedAt?: string };
        contentDetails?: { duration?: string };
        statistics?: { viewCount?: string };
      }[];
    };
    return (data.items ?? []).map((item) => ({
      id: item.id ?? "",
      title: item.snippet?.title ?? "",
      description: item.snippet?.description ?? "",
      channel: item.snippet?.channelTitle ?? "",
      channelId: item.snippet?.channelId ?? "",
      publishedAt: item.snippet?.publishedAt ?? "",
      url: item.id ? `https://www.youtube.com/watch?v=${item.id}` : "",
      views: Number(item.statistics?.viewCount ?? 0),
      durationSec: parseDuration(item.contentDetails?.duration ?? ""),
    }));
  } catch {
    return [];
  }
}

function qualifies(c: Candidate): boolean {
  if (!c.id) return false;
  const titleBlob = c.title.toLowerCase();
  const fullBlob = `${c.title} ${c.description}`.toLowerCase();
  // Relevance: topic + Texas/landowner angle in the title, no blocked junk.
  if (!hasAny(titleBlob, TOPIC_TERMS)) return false;
  if (!hasAny(titleBlob, TEXAS_TERMS)) return false;
  if (hasAny(fullBlob, BLOCK_TERMS)) return false;
  // Not a Short / throwaway.
  if (c.durationSec < MIN_DURATION_SEC) return false;
  // Freshness.
  if (c.publishedAt) {
    const ageDays = (Date.now() - new Date(c.publishedAt).getTime()) / 86_400_000;
    if (ageDays > MAX_AGE_DAYS) return false;
  }
  // Not an amateur upload — unless from a trusted channel.
  if (!TRUSTED_CHANNELS.has(c.channelId) && c.views < MIN_VIEWS) return false;
  return true;
}

/**
 * The featured video for the news section. Never throws — always resolves to a
 * usable video (live pick, or the evergreen fallback).
 */
export async function getFeaturedVideo(): Promise<FeaturedVideo> {
  if (PINNED_VIDEO?.id) return PINNED_VIDEO;

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return FALLBACK_VIDEO;

  try {
    const ids = await searchVideoIds(key);
    const candidates = (await hydrate(key, ids)).filter(qualifies);
    if (candidates.length === 0) return FALLBACK_VIDEO;
    // Newest qualifying video wins.
    candidates.sort((a, b) =>
      a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
    );
    const top = candidates[0];
    return { id: top.id, title: top.title, channel: top.channel, publishedAt: top.publishedAt, url: top.url };
  } catch {
    return FALLBACK_VIDEO;
  }
}
