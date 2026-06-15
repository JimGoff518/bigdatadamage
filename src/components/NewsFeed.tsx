import { getDataCenterNews } from "@/lib/news";
import { Icon } from "@/components/Icons";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Async server component. Fetches aggregated Google News headlines (cached
// hourly) and renders them as outbound links. Renders nothing if the feed is
// empty/unreachable so it never breaks the page.
export async function NewsFeed() {
  const items = await getDataCenterNews(12);
  if (items.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <a
          key={item.link}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-md border border-line bg-panel p-4 shadow-card transition-colors hover:border-orange/60"
        >
          <h3 className="font-semibold leading-snug text-fg group-hover:text-orange">
            {item.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs text-fg-dim">
            <span className="font-semibold text-fg/70">{item.source}</span>
            {item.isoDate && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={item.isoDate}>{formatDate(item.isoDate)}</time>
              </>
            )}
            <Icon
              name="arrow"
              width={14}
              height={14}
              className="ml-auto text-orange opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        </a>
      ))}
    </div>
  );
}
