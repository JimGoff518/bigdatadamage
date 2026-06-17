import { getDataCenterNews } from "@/lib/news";

// A thin "breaking news" bar that scrolls the latest data-center headlines
// across the very top of the site. Server component: pulls from the same
// Google News RSS aggregation as /news (cached 6h). Renders nothing if the
// feed is empty so a hiccup never leaves an empty bar.
export async function NewsTicker() {
  const items = await getDataCenterNews(14);
  if (items.length === 0) return null;

  // Two identical copies so translateX(-50%) loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="ticker-bar relative w-full overflow-hidden border-b border-orange/40 bg-night text-paper">
      {/* Fixed "LATEST" label that masks the scroll start */}
      <div className="absolute inset-y-0 left-0 z-10 flex items-center gap-1.5 bg-night pl-4 pr-3 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-bright shadow-[10px_0_12px_-6px_var(--color-night)]">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-bright" />
        Latest
      </div>

      <div className="flex">
        <div className="ticker-track flex shrink-0 items-center whitespace-nowrap py-2 text-sm">
          {loop.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={i >= items.length ? true : undefined}
              tabIndex={i >= items.length ? -1 : undefined}
              className="inline-flex items-center gap-2 pr-10 text-paper/90 transition-colors hover:text-orange-bright"
            >
              <span className="text-hazard">&#9656;</span>
              <span>{item.title}</span>
              <span className="text-paper/45">&mdash; {item.source}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
