import type { Metadata } from "next";
import { siteConfig, type Locale } from "~/site.config";
import { withBase } from "./base";

/** Public path for a locale. Every locale is in the path: "/fr/cars", "/ar/cars". */
export function localePath(locale: string, path = "/") {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}/`;
}

/** canonical + hreflang alternates for a locale-independent path. */
export function alternates(locale: string, path = "/"): Metadata["alternates"] {
  const url = (l: string) => withBase(localePath(l, path));
  const languages = Object.fromEntries(siteConfig.locales.map((l: Locale) => [l, url(l)]));
  return { canonical: url(locale), languages: { ...languages, "x-default": url(siteConfig.defaultLocale) } };
}
