import type { Metadata } from "next";
import { siteConfig, type Locale } from "~/site.config";

/** Public path for a locale: the default locale has no prefix ("/cars"), others do ("/ar/cars"). */
export function localePath(locale: string, path = "/") {
  const clean = path === "/" ? "" : path;
  return locale === siteConfig.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

/** canonical + hreflang alternates for a locale-independent path. */
export function alternates(locale: string, path = "/"): Metadata["alternates"] {
  const languages = Object.fromEntries(siteConfig.locales.map((l: Locale) => [l, localePath(l, path)]));
  return { canonical: localePath(locale, path), languages: { ...languages, "x-default": localePath(siteConfig.defaultLocale, path) } };
}
