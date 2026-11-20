import { setRequestLocale } from "next-intl/server";
import { cars } from "@/lib/cars";
import Hero from "@/components/Hero";
import Tour from "@/components/Tour";
import Showroom from "@/components/Showroom";
import Inventory from "@/components/Inventory";
import { About, Stats } from "@/components/Sections";
import ContactSection from "@/components/ContactSection";
import { JsonLd, dealerLd } from "@/components/JsonLd";

export default async function Home({ params }: { params: Promise<{ locale: "ar" | "fr" }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const featuredFirst = [...cars].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <>
      <JsonLd data={dealerLd(locale)} />
      <Hero />
      <div className="veil">
        <Showroom cars={featuredFirst} />
      </div>
      <Tour />
      <div className="veil">
        <Stats />
        <Inventory cars={cars} />
        <About />
        <ContactSection />
      </div>
    </>
  );
}
