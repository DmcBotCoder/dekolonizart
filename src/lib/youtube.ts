const VIDEO_ID = /^[\w-]{11}$/;
const HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com']);

/**
 * Video id of a YouTube link (watch, youtu.be, shorts, live or embed URL).
 * Throws on anything else so a mistyped link fails the build instead of
 * rendering a broken player.
 */
export function youTubeId(link: string): string {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    throw new Error(`Intro video: "${link}" is not a URL.`);
  }
  let id: string | null = null;
  if (url.hostname === 'youtu.be') {
    id = url.pathname.slice(1);
  } else if (HOSTS.has(url.hostname)) {
    id = url.pathname === '/watch' ? url.searchParams.get('v') : (url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null);
  }
  if (!id || !VIDEO_ID.test(id)) throw new Error(`Intro video: "${link}" is not a YouTube video link.`);
  return id;
}

/**
 * Privacy-enhanced embed URL (youtube-nocookie.com: no cookies until the
 * visitor plays). Looping a single video needs `playlist` set to its own id.
 * Browsers only allow autoplay without a click when the video is muted.
 */
export function youTubeEmbedUrl(id: string, { autoplay }: { autoplay: boolean }): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: autoplay ? '1' : '0',
    loop: '1',
    playlist: id,
    playsinline: '1',
    rel: '0',
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}
