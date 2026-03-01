export type LinkMeta = {
  title: string;
  publisher: string;
  date: string | null;
};

const CACHE_KEY = 'bib-link-meta-v1';
const API_BASE = 'https://api.microlink.io';

function readCache(): Record<string, LinkMeta> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, LinkMeta>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage might be full or unavailable
  }
}

async function fetchSingle(url: string): Promise<LinkMeta | null> {
  try {
    const res = await fetch(
      `${API_BASE}/?url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 'success' || !json.data) return null;

    return {
      title: json.data.title || '',
      publisher: json.data.publisher || '',
      date: json.data.date || null,
    };
  } catch {
    return null;
  }
}

/**
 * Fetches metadata for a list of URLs, returning cached results
 * immediately and fetching uncached URLs in parallel.
 */
export async function fetchAllLinkMeta(
  urls: string[],
): Promise<Record<string, LinkMeta>> {
  const cache = readCache();
  const results: Record<string, LinkMeta> = {};
  const uncached: string[] = [];

  for (const url of urls) {
    if (cache[url]) {
      results[url] = cache[url];
    } else {
      uncached.push(url);
    }
  }

  if (uncached.length === 0) return results;

  const fetched = await Promise.all(uncached.map(fetchSingle));

  const freshCache = readCache();
  uncached.forEach((url, i) => {
    const meta = fetched[i];
    if (meta) {
      results[url] = meta;
      freshCache[url] = meta;
    }
  });
  writeCache(freshCache);

  return results;
}
