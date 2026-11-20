/**
 * Sub-path the site is served from (e.g. "/mirou-auto" on GitHub Pages project sites; empty on a root domain).
 * Next prefixes its own routes and chunks; raw public-file URLs (media, car photos) go through withBase().
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBase = (p: string) => (BASE && p.startsWith("/") && !p.startsWith("//") && !p.startsWith(BASE + "/") ? BASE + p : p);

/** Deep-copies JSON data, prefixing every root-relative string (manifest URLs, image paths). */
export function rebase<T>(v: T): T {
  if (!BASE) return v;
  if (typeof v === "string") return withBase(v) as T;
  if (Array.isArray(v)) return v.map(rebase) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, rebase(x)])) as T;
  return v;
}
