import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// GitHub Pages project site (https://<owner>.github.io/<repo>/): inside GitHub Actions the repo name gives the
// sub-path. Locally, or with an explicit NEXT_PUBLIC_BASE_PATH, that value wins (empty = served from the root).
const repo = process.env.GITHUB_ACTIONS ? process.env.GITHUB_REPOSITORY?.split("/")[1] : undefined;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (repo ? `/${repo}` : "");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (repo ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io` : undefined);

// Static export: the site is served as plain files (GitHub Pages / any static host).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath, ...(siteUrl && { NEXT_PUBLIC_SITE_URL: siteUrl }) },
};

export default withNextIntl(nextConfig);
