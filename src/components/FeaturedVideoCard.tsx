import { getFeaturedVideo } from "@/lib/youtube";
import { VideoEmbed } from "@/components/VideoEmbed";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Async server component. Fetches the auto-selected (or fallback) featured
// video and renders it as a prominent card above the headline list. The embed
// itself is a lazy facade, so it stays fast for Core Web Vitals.
export async function FeaturedVideoCard() {
  const video = await getFeaturedVideo();
  if (!video?.id) return null;

  const date = formatDate(video.publishedAt);

  return (
    <div className="overflow-hidden rounded-md border border-line bg-panel shadow-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-4 text-xs text-fg-dim">
        <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          ▶ Video
        </span>
        {date && (
          <>
            <time dateTime={video.publishedAt}>{date}</time>
            <span aria-hidden>·</span>
          </>
        )}
        <span className="font-semibold text-fg/70">{video.channel}</span>
      </div>

      <div className="px-4 pt-2">
        <h3 className="text-lg font-bold leading-snug text-fg sm:text-xl">{video.title}</h3>
      </div>

      <div className="px-4 pb-4">
        {/* VideoEmbed adds its own vertical margin via my-8; trim it here. */}
        <VideoEmbed id={video.id} title={video.title} className="my-3" />
      </div>
    </div>
  );
}
