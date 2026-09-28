/** Tipos y categorías del blog (sin dependencias de Node: se puede importar en el cliente). */
export const categories = [
  { slug: "marketing-digital", name: "Marketing digital" },
  { slug: "redes-sociales", name: "Redes sociales" },
  { slug: "publicidad-digital", name: "Publicidad digital" },
  { slug: "consejos-para-marcas", name: "Consejos para marcas" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const authors: Record<string, { name: string; role: string }> = {
  felipe: { name: "Felipe", role: "Content Curator" },
  martin: { name: "Martín", role: "Especialista SEO" },
  sofia: { name: "Sofía", role: "Copywriter" },
  "maria-isabel": { name: "María Isabel", role: "Social Media Manager" },
};

export type PostMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  category: CategorySlug;
  categoryName: string;
  author: { name: string; role: string };
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  keyword: string;
  readingMinutes: number;
  words: number;
  toc: { id: string; text: string }[];
};

export type Post = PostMeta & { content: string };

