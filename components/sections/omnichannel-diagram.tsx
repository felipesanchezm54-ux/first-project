"use client";

import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { channels, panelNode } from "@/lib/content/omnichannel";
import { cn } from "@/lib/utils";

/**
 * Diagrama omnicanal interactivo. Los nodos son botones reales: funcionan con
 * mouse (hover), teclado (foco) y toque. La explicación aparece en un panel de
 * texto anunciado con aria-live, no en un tooltip.
 */
export function OmnichannelDiagram() {
  const [active, setActive] = useState<string>("panel");
  const current = channels.find((c) => c.id === active) ?? panelNode;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
      <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
        <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {channels.map((c) => (
            <line
              key={c.id}
              x1={c.x}
              y1={(c.y * 75) / 100}
              x2={50}
              y2={(48 * 75) / 100}
              stroke={active === c.id || active === "panel" ? "var(--c-accent)" : "var(--c-border)"}
              vectorEffect="non-scaling-stroke"
              className={cn(active === c.id && "anim-flow")}
              style={{ strokeWidth: active === c.id ? 3 : 1.5 }}
            />
          ))}
        </svg>

        <button
          type="button"
          onMouseEnter={() => setActive("panel")}
          onFocus={() => setActive("panel")}
          onClick={() => setActive("panel")}
          aria-pressed={active === "panel"}
          className={cn(
            "absolute left-1/2 top-[48%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-3xl border-2 px-4 py-3 font-display text-sm font-semibold shadow-lift transition-colors md:px-6 md:py-4 md:text-base",
            active === "panel" ? "border-accent bg-cta text-cta-fg" : "border-border bg-surface text-fg",
          )}
        >
          <LayoutDashboard aria-hidden className="h-6 w-6" />
          Panel NEXO
        </button>

        {channels.map((c) => (
          <button
            key={c.id}
            type="button"
            onMouseEnter={() => setActive(c.id)}
            onFocus={() => setActive(c.id)}
            onClick={() => setActive(c.id)}
            aria-pressed={active === c.id}
            className={cn(
              "absolute min-h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-3 py-2 text-sm font-semibold shadow-lift transition-[background-color,border-color,transform] md:px-4 md:text-base",
              active === c.id ? "scale-105 border-accent bg-accent text-bg" : "border-border bg-surface text-fg hover:border-accent",
            )}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            {c.short}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="card p-7">
        <p className="eyebrow">Canal seleccionado</p>
        <h3 className="mt-2 text-h3 font-semibold">{current.name}</h3>
        <p className="mt-4 text-muted">
          <strong className="text-fg">Rol: </strong>
          {current.role}
        </p>
        <p className="mt-3 text-muted">
          <strong className="text-fg">Dato que alimenta al panel: </strong>
          {current.feeds}
        </p>
        <p className="mt-6 text-sm text-muted">Pasa el cursor, usa Tab o toca cada canal para ver su función.</p>
      </div>
    </div>
  );
}
