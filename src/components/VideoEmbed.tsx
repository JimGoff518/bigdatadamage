"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { parseYouTubeId, youtubeThumb } from "@/lib/youtube";

type VideoEmbedProps = {
  /** A bare YouTube video id. */
  id?: string;
  /** Any YouTube URL (watch, youtu.be, embed, shorts). Used if `id` is absent. */
  url?: string;
  /** Accessible label / iframe title. */
  title?: string;
  className?: string;
};

/**
 * Lazy "facade" YouTube embed: shows the thumbnail + play button and only loads
 * the (cookie-less) player on click. Keeps pages fast for Core Web Vitals / SEO.
 * Drop it on any page: <VideoEmbed url="https://youtu.be/..." title="..." />
 */
export function VideoEmbed({ id, url, title = "Watch video", className }: VideoEmbedProps) {
  const videoId = id ?? (url ? parseYouTubeId(url) : null);
  const [active, setActive] = useState(false);

  if (!videoId) return null;

  return (
    <div
      className={cn(
        "group relative my-8 aspect-video w-full overflow-hidden rounded-md border border-line bg-night shadow-card",
        className,
      )}
    >
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={youtubeThumb(videoId)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-night/40 transition group-hover:bg-night/20" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange shadow-lg transition group-hover:bg-orange-bright">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="ml-1 text-white"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
