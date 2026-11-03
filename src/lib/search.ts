/**
 * Forgiving text search: lower case, no accents, typographic quotes and
 * dashes folded, so "evenement" finds "Événement" and "tragedie" finds
 * "Tragédie".
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘`´]/g, "'")
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when every word of the query occurs in the (already normalised) haystack. An empty query matches everything. */
export function matchesQuery(haystack: string, query: string): boolean {
  return normalizeForSearch(query)
    .split(' ')
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}
