"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string };

/** Índice con scrollspy: lateral fijo en escritorio y pestañas horizontales en móvil. */
export function ScrollSpy({ items, variant }: { items: Item[]; variant: "side" | "tabs" }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (variant !== "tabs" || !active) return;
    document.getElementById(`tab-${active}`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active, variant]);

  if (variant === "tabs") {
    return (
      <nav aria-label="Servicios en esta página" className="sticky top-[var(--header-h)] z-30 -mx-4 border-b border-border bg-bg/95 backdrop-blur lg:hidden">
        <ul className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {items.map((i) => (
            <li key={i.id} className="shrink-0">
              <a
                id={`tab-${i.id}`}
                href={`#${i.id}`}
                aria-current={active === i.id ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                  active === i.id ? "border-accent bg-accent text-bg" : "border-border text-fg",
                )}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Servicios en esta página" className="sticky top-[calc(var(--header-h)+2rem)] hidden lg:block">
      <p className="eyebrow">En esta página</p>
      <ul className="mt-4 space-y-1 border-l border-border">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={cn(
                "-ml-px flex min-h-11 items-center border-l-2 pl-4 transition-colors",
                active === i.id ? "border-accent font-semibold text-accent" : "border-transparent text-muted hover:text-fg",
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
