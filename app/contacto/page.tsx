import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { ContactForm } from "@/components/forms/contact-form";
import { FaqAccordion } from "@/components/sections/faq";
import { ButtonLink } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { JsonLd } from "@/components/seo/json-ld";
import { contactFaqs } from "@/lib/content/faqs";
import { faqJsonLd } from "@/lib/jsonld";
import { site, whatsappUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contratar agencia de marketing en Medellín | NEXO",
  description:
    "¿Quieres contratar una agencia de marketing en Medellín? Escríbenos por formulario o WhatsApp y agenda una asesoría gratuita. Respondemos en 24 horas.",
  path: "/contacto",
  keywords: ["contratar agencia de marketing Medellín", "asesoría de marketing digital gratis"],
});

export default function ContactoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contacto", path: "/contacto" }]}
        eyebrow="Contacto"
        title={
          <>
            Contratar una agencia de marketing en Medellín <span className="text-gradient">empieza con una conversación</span>
          </>
        }
        lead={<p>Déjanos tus datos y lo que quieres lograr. Te respondemos en menos de 24 horas hábiles para agendar una asesoría gratuita de 30 minutos.</p>}
      />

      <Section tone="light" labelledBy="formulario" className="pt-12">
        <h2 id="formulario" className="sr-only">
          Formulario y canales de contacto
        </h2>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Suspense fallback={<div className="card h-[32rem] animate-pulse" aria-hidden />}>
            <ContactForm />
          </Suspense>

          <aside aria-labelledby="canales" className="space-y-5">
            <div className="card p-7">
              <h2 id="canales" className="text-h3 font-semibold">
                ¿Prefieres otro canal?
              </h2>
              <p className="mt-2 text-muted">WhatsApp es la forma más rápida. El mensaje ya va escrito; solo tienes que enviarlo.</p>
              <ButtonLink href={whatsappUrl()} variant="secondary" className="mt-5 w-full">
                <WhatsAppIcon className="h-5 w-5" /> Escribir por WhatsApp
              </ButtonLink>
              <ul className="mt-6 space-y-3 text-muted">
                <li className="flex gap-3">
                  <Mail aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <a href={`mailto:${site.email}`} className="link">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <a href={`tel:${site.phoneE164}`} className="link">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    {site.address.street}, {site.address.city}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Clock aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>{site.hours}</span>
                </li>
              </ul>
            </div>
            <div className="card p-7">
              <h3 className="font-display text-lg font-semibold">Síguenos</h3>
              <ul className="mt-4 flex gap-2">
                {[
                  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
                  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
                  { href: site.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
                  { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                ].map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} de NEXO`}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section labelledBy="faq">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            id="faq"
            eyebrow="Preguntas frecuentes"
            title="Lo que suelen preguntarnos antes de contratar"
            answer="Si tu pregunta no está aquí, escríbela en el formulario o pregúntale a Vera, nuestra agente de IA, en el chat de la esquina."
          />
          <FaqAccordion faqs={contactFaqs} />
        </div>
      </Section>

      <section aria-labelledby="cta-contacto" className="pb-24">
        <div className="container-nexo text-center">
          <h2 id="cta-contacto" className="text-h2 font-bold">
            ¿Listo para medir lo que haces?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">30 minutos, sin costo y sin compromiso. Sales con una meta clara para tu marca.</p>
          <ButtonLink href="#formulario" size="lg" className="mt-8">
            Solicita una asesoría
          </ButtonLink>
        </div>
      </section>

      <JsonLd data={faqJsonLd(contactFaqs)} />
    </>
  );
}
