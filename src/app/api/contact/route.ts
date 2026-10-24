import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { carName, getCar } from "@/lib/cars";
import { whatsappUrl } from "@/lib/contact";
import { siteConfig } from "~/site.config";

type Body = { name?: string; phone?: string; email?: string; car?: string; date?: string; message?: string; locale?: string; company?: string };

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Sends the lead by e-mail (Resend, if configured) and returns a pre-filled WhatsApp link for the visitor. */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  if (body.company) return NextResponse.json({ ok: true, whatsapp: "" }); // honeypot

  const locale = body.locale === "fr" ? "fr" : "ar";
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  if (name.length < 2 || !/^[+0-9 ]{9,16}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  const car = body.car ? getCar(clean(body.car, 80)) : undefined;
  const t = await getTranslations({ locale, namespace: "contact" });
  const text = t("waLead", {
    name,
    phone,
    car: car ? `${carName(car)} ${car.year}` : "—",
    date: clean(body.date, 10) || "—",
    message: clean(body.message, 1000) || "—",
  });

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (RESEND_API_KEY && CONTACT_TO_EMAIL) {
    const email = clean(body.email, 120);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`,
        to: CONTACT_TO_EMAIL.split(","),
        reply_to: email || undefined,
        subject: `${siteConfig.name} — ${name}${car ? ` · ${carName(car)}` : ""}`,
        text: `${text}\nEmail: ${email || "—"}`,
      }),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[contact] email not configured — lead:\n" + text);
  }

  return NextResponse.json({ ok: true, whatsapp: whatsappUrl(text) });
}
