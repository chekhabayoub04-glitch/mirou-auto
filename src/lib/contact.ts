import { withBase } from "./base";
import { siteConfig } from "~/site.config";

export const whatsappUrl = (text: string) => `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`;

export const absoluteUrl = (path: string) => new URL(withBase(path), siteConfig.url).toString();

export const mapsUrl = () => {
  const { city, wilaya } = siteConfig.address;
  const location = `${city.fr}, ${wilaya.fr}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};
