"use client";

import Link from "next/link";
import { useState } from "react";
import { ChartBar, Clapperboard, Funnel, LayoutTemplate, Mail, Palette, QrCode, Route, type LucideIcon } from "lucide-react";
import type { PortfolioItem } from "@/lib/content/cases";
import { cn } from "@/lib/utils";

const art: Record<PortfolioItem["art"], { icon: LucideIcon; bg: string }> = {
  branding: { icon: Palette, bg: "from-[#085042] to-[#1f9e75]" },
  benchmark: { icon: ChartBar, bg: "from-[#1f9e75] to-[#0b6448]" },
  journey: { icon: Route, bg: "from-[#5047bf] to-[#7f77dc]" },
  data: { icon: QrCode, bg: "from-[#085042] to-[#5047bf]" },
  email: { icon: Mail, bg: "from-[#7f77dc] to-[#1f9e75]" },
  content: { icon: Clapperboard, bg: "from-[#0b6448] to-[#7f77dc]" },
  funnel: { icon: Funnel, bg: "from-[#1f9e75] to-[#5047bf]" },
  landing: { icon: LayoutTemplate, bg: "from-[#085042] to-[#0b6448]" },
};

/** Portafolio visual en grilla, filtrable por servicio. Cada pieza lleva su cifra al lado. */
export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const filters = [{ value: "todos", label: "Todos" }, ...Array.from(new Map(items.map((i) => [i.service, i.serviceLabel])).entries()).map(([value, label]) => ({ value, label }))];
  const [active, setActive] = useState("todos");
  const count = active === "todos" ? items.length : items.filter((i) => i.service === active).length;

  return (
    <div>
      <div role="group" aria-label="Filtrar portafolio por servicio" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={active === f.value}
            onClick={() => setActive(f.value)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
              active === f.value ? "border-accent bg-accent text-bg" : "border-border text-fg hover:border-accent",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {count} piezas visibles
      </p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const A = art[item.art];
          return (
            <li key={item.title} hidden={active !== "todos" && item.service !== active}>
              <Link href={item.href} className="card group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className={cn("relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br", A.bg)}>
                  <A.icon aria-hidden className="h-16 w-16 text-white/90 transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white">{item.serviceLabel}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-muted">{item.brand}</p>
                  <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.description}</p>
                  <p className="mt-auto pt-5 font-display font-semibold text-accent">{item.stat}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
