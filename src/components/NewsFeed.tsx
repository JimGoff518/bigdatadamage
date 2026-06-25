import { getDataCenterNews } from "@/lib/news";
import { Icon } from "@/components/Icons";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Async server component. Fetches aggregated Google News headlines (cached
// hourly) and renders them as a clean, scannable list of outbound links: date
// and source on the left, headline center, "Read" affordance on the right.
// Renders nothing if the feed is empty/unreachable so it never breaks the page.
export async function NewsFeed() {
  const items = await getDataCenterNews(12);
  if (items.length === 0) return null;

  return (
    <ul className="divide-y divide-line/70 overflow-hidden rounded-md border border-line bg-panel shadow-card">
      {items.map((item) => (
        <li key={item.link}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 border-l-4 border-transparent px-4 py-4 transition-colors hover:border-orange hover:bg-panel-2/40"
          >
            <div className="w-24 shrink-0 text-xs sm:w-28">
              {item.isoDate && (
                <time dateTime={item.isoDate} className="block font-semibold text-fg">
                  {formatDate(item.isoDate)}
                </time>
              )}
              <span className="block text-fg-dim">{item.source}</span>
            </div>

            <h3 className="flex-1 font-semibold leading-snug text-fg group-hover:text-orange">
              {item.title}
            </h3>

            <span className="ml-auto hidden shrink-0 items-center gap-1 self-center text-sm font-semibold text-orange opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
              Read
              <Icon name="arrow" width={14} height={14} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
