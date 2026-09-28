import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog-meta";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return (
    <article className={`card group relative flex h-full flex-col p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift ${featured ? "md:p-10" : ""}`}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <span className="rounded-full bg-surface-2 px-3 py-1 font-semibold text-accent">{post.categoryName}</span>
        <span className="inline-flex items-center gap-1">
          <Clock aria-hidden className="h-3.5 w-3.5" /> {post.readingMinutes} min de lectura
        </span>
      </p>
      <h3 className={`mt-5 font-bold ${featured ? "text-h2" : "text-h3"}`}>
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 text-muted">{post.excerpt}</p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
        <span className="text-muted">
          {post.author.name} · Actualizado el <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
        </span>
        <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
      </div>
    </article>
  );
}
