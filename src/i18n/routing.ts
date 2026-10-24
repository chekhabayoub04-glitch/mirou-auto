import { defineRouting } from "next-intl/routing";
import { siteConfig } from "~/site.config";

export const routing = defineRouting({
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "as-needed", // French (default) at "/", Arabic at "/ar"
  localeDetection: false,
});
