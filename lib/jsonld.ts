import { absoluteUrl, site } from "@/lib/site";
import type { Service } from "@/lib/content/services";
import type { Faq } from "@/lib/content/faqs";

const orgId = `${site.url}/#organization`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/opengraph-image"),
    email: site.email,
    telephone: site.phoneE164,
    foundingDate: String(site.foundingYear),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: { "@type": "Country", name: "Colombia" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    sameAs: Object.values(site.socials),
    knowsAbout: ["Marketing digital", "SEO", "Redes sociales", "Publicidad digital", "Email marketing", "Analítica web"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "es-CO",
    publisher: { "@id": orgId },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function servicesJsonLd(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@graph": services.map((s) => ({
      "@type": "Service",
      "@id": absoluteUrl(`/servicios#${s.slug}`),
      name: s.title,
      description: s.answer,
      serviceType: s.title,
      provider: { "@id": orgId },
      areaServed: { "@type": "Country", name: "Colombia" },
      url: absoluteUrl(`/servicios#${s.slug}`),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  path: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    mainEntityOfPage: absoluteUrl(a.path),
    url: absoluteUrl(a.path),
    image: absoluteUrl(`${a.path}/opengraph-image`),
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    inLanguage: "es-CO",
    articleSection: a.section,
    author: { "@type": "Person", name: a.author, jobTitle: a.authorRole, worksFor: { "@id": orgId } },
    publisher: { "@id": orgId },
  };
}
