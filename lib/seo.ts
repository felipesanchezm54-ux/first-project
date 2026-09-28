import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";

type PageMeta = {
  /** Title completo (≤ 60 caracteres), formato "Keyword principal | NEXO". */
  title: string;
  /** Meta descripción de 120–155 caracteres con keyword y CTA. */
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, keywords, type = "website", publishedTime, modifiedTime, authors, noindex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      // Imagen OG propia por defecto (las rutas con su propio opengraph-image.tsx la reemplazan).
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NEXO, agencia de marketing digital en Medellín" }],
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
