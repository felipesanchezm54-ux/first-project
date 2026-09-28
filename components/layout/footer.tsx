import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { LazyNewsletterForm } from "@/components/lazy/lazy-forms";
import { legalNav, mainNav, site, whatsappUrl } from "@/lib/site";
import { services } from "@/lib/content/services";

const socials = [
  { href: site.socials.instagram, label: "Instagram de NEXO", Icon: InstagramIcon },
  { href: site.socials.facebook, label: "Facebook de NEXO", Icon: FacebookIcon },
  { href: site.socials.tiktok, label: "TikTok de NEXO", Icon: TikTokIcon },
  { href: site.socials.linkedin, label: "LinkedIn de NEXO", Icon: LinkedInIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-night" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Información de NEXO
      </h2>
      <div className="container-nexo grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="NEXO, ir al inicio" className="inline-block rounded-lg">
            <Logo showTagline />
          </Link>
          <p className="mt-5 max-w-sm text-muted">
            Marketing digital que se mide, desde Medellín para marcas y pymes de Colombia.
          </p>
          <div className="mt-8">
            <p id="newsletter-footer" className="font-display font-semibold">
              Un correo al mes con lo que funcionó
            </p>
            <p className="mt-1 text-sm text-muted">Casos, cifras y un consejo aplicable. Sin spam.</p>
            <LazyNewsletterForm source="footer" labelledBy="newsletter-footer" className="mt-4" />
          </div>
        </div>

        <nav aria-label="Páginas" className="lg:col-span-2">
          <p className="font-display font-semibold">Navegación</p>
          <ul className="mt-4 space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center text-muted hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/panel" className="inline-flex min-h-10 items-center text-muted hover:text-accent">
                Panel de clientes
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Servicios" className="lg:col-span-3">
          <p className="font-display font-semibold">Servicios</p>
          <ul className="mt-4 space-y-1">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios#${s.slug}`} className="inline-flex min-h-10 items-center text-muted hover:text-accent">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="font-display font-semibold">Contacto</p>
          <address className="mt-4 space-y-3 not-italic text-muted">
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <span>
                {site.address.street}, {site.address.city}, {site.address.region}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:${site.phoneE164}`} className="hover:text-accent">
                {site.phoneDisplay}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${site.email}`} className="hover:text-accent">
                {site.email}
              </a>
            </p>
            <p className="flex gap-3">
              <Clock aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <span>{site.hours}</span>
            </p>
          </address>
          <ul className="mt-6 flex gap-2" aria-label="Redes sociales">
            {socials.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir a NEXO por WhatsApp"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-nexo flex flex-col gap-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. Todos los derechos reservados. Proyecto académico · CEIPA Business School.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Enlaces legales">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
