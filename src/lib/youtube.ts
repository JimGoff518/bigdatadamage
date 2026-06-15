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
