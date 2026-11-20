// Central brand/contact config. All values are PLACEHOLDERS — replace before launch.
export const siteConfig = {
  name: "MIROU AUTO",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mirou-auto.example.com", // PLACEHOLDER
  defaultLocale: "fr" as const,
  locales: ["fr", "ar"] as const,
  contact: {
    phone: "+213 551 77 10 77",
    phoneHref: "tel:+213551771077",
    whatsapp: "213551771077", // Number shown on the provided storefront photo
    email: "contact@mirou-auto.example.com", // PLACEHOLDER
  },
  address: {
    street: { ar: "العنوان الدقيق يُضاف لاحقاً", fr: "Adresse exacte à confirmer" },
    city: { ar: "خنشلة", fr: "Khenchela" },
    wilaya: { ar: "ولاية خنشلة (40)", fr: "Wilaya de Khenchela (40)" },
    postalCode: "40000",
    country: "DZ",
    mapsEmbedUrl: "", // Add the exact showroom map after confirming its address
  },
  hours: [
    // PLACEHOLDER — 24h format
    { days: "sat-thu", open: "09:00", close: "18:00" },
    { days: "fri", open: null, close: null },
  ],
  socials: {
    facebook: "https://www.facebook.com/mirouauto/?locale=fr_FR",
    instagram: "https://instagram.com/", // PLACEHOLDER
    tiktok: "https://tiktok.com/", // PLACEHOLDER
    youtube: "", // PLACEHOLDER
  },
  currency: "DZD",
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
