import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { tiendaOptica } from "@/lib/content/cases";
import { absoluteUrl } from "@/lib/site";

// Fecha de la última revisión de contenido de las páginas estáticas.
const CONTENT_UPDATED = "2026-09-27";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/servicios", priority: 0.9, freq: "monthly" },
    { path: "/planes", priority: 0.9, freq: "monthly" },
    { path: "/portafolio", priority: 0.8, freq: "monthly" },
    { path: "/nosotros", priority: 0.7, freq: "monthly" },
    { path: "/contacto", priority: 0.8, freq: "yearly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/privacidad", priority: 0.2, freq: "yearly" },
    { path: "/terminos", priority: 0.2, freq: "yearly" },
    { path: "/cookies", priority: 0.2, freq: "yearly" },
  ];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p.path), lastModified: CONTENT_UPDATED, changeFrequency: p.freq, priority: p.priority })),
    { url: absoluteUrl(`/portafolio/${tiendaOptica.slug}`), lastModified: tiendaOptica.updatedAt, changeFrequency: "monthly", priority: 0.8 },
    ...getAllPosts().map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
