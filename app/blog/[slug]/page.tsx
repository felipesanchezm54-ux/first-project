import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, RefreshCw } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { Mdx } from "@/components/blog/mdx";
import { PostCard } from "@/components/blog/post-card";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPosts, getPost, toMeta } from "@/lib/blog";
import { articleJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: [post.keyword],
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author.name],
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)
    .map(toMeta);

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="grain pb-12 pt-[calc(var(--header-h)+2rem)]">
          <div className="container-nexo">
            <Breadcrumbs
              items={[
                { name: "Blog", path: "/blog" },
                { name: post.title, path: `/blog/${post.slug}` },
              ]}
            />
            <p className="eyebrow mt-10">{post.categoryName}</p>
            <h1 className="mt-4 max-w-4xl text-h1 font-bold">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-lead text-muted">{post.excerpt}</p>

            {/* E-E-A-T: autor con rol y fechas visibles. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
              <p className="flex items-center gap-3">
                <span aria-hidden className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#1f9e75] to-[#085042] font-display font-bold text-white">
                  {post.author.name[0]}
                </span>
                <span>
                  <span className="block font-semibold text-fg">{post.author.name}</span>
                  {post.author.role} en NEXO
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarDays aria-hidden className="h-4 w-4" /> Publicado el <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </p>
              <p className="flex items-center gap-1.5">
                <RefreshCw aria-hidden className="h-4 w-4" /> Actualizado el <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock aria-hidden className="h-4 w-4" /> {post.readingMinutes} min de lectura
              </p>
            </div>
          </div>
        </header>

        <div data-tone="light" className="py-16">
          <div className="container-nexo grid gap-12 lg:grid-cols-[1fr_16rem]">
            <div className="prose-nexo min-w-0 max-w-[68ch]">
              <Mdx source={post.content} />
            </div>
            <aside className="order-first lg:order-last">
              <nav aria-label="Tabla de contenido" className="card p-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <p className="font-display font-semibold">En este artículo</p>
                <ol className="mt-4 space-y-2 text-sm">
                  {post.toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="inline-flex min-h-9 items-center text-muted underline-offset-4 hover:text-accent hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          </div>
        </div>
      </article>

      <section aria-labelledby="relacionados" className="py-20">
        <div className="container-nexo">
          <h2 id="relacionados" className="text-h2 font-bold">
            Sigue leyendo
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/blog" className="link font-semibold">
              Ver todos los artículos del blog
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        id="cta-post"
        title="¿Quieres aplicarlo en tu marca?"
        body="Agenda una asesoría gratuita y revisamos juntos cómo medir lo que acabas de leer en tu propio negocio."
        cta="Agenda tu asesoría"
        href="/contacto"
      />

      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          author: post.author.name,
          authorRole: post.author.role,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          section: post.categoryName,
        })}
      />
    </>
  );
}
