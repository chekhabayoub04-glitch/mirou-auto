import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
  },
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/media/:path*", headers: immutable },
      { source: "/cars/:slug/:file(.+\\.(?:webp|avif|jpg|png))", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
    ];
  },
};

export default withNextIntl(nextConfig);
