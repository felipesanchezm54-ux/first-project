"use client";

import { useState } from "react";
import type { PostMeta } from "@/lib/blog-meta";
import { categories } from "@/lib/blog-meta";
import { PostCard } from "@/components/blog/post-card";
import { cn } from "@/lib/utils";

/** Filtro por categoría. Los artículos están todos en el HTML (rastreables); el filtro solo oculta. */
export function PostFilter({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState<string>("todas");
  const visible = active === "todas" ? posts : posts.filter((p) => p.category === active);
  const options = [{ slug: "todas", name: "Todas" }, ...categories];

  return (
    <div>
      <div role="group" aria-label="Filtrar artículos por categoría" className="flex flex-wrap gap-2">
        {options.map((c) => {
          const count = c.slug === "todas" ? posts.length : posts.filter((p) => p.category === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              aria-pressed={active === c.slug}
              onClick={() => setActive(c.slug)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                active === c.slug ? "border-accent bg-accent text-bg" : "border-border text-fg hover:border-accent",
              )}
            >
              {c.name}
              <span className="text-xs opacity-80">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} artículos visibles
      </p>
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug} hidden={!visible.includes(p)}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
