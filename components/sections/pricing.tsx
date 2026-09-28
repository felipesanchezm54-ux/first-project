"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { QUARTERLY_DISCOUNT, plans } from "@/lib/content/plans";
import { cn, formatCOP } from "@/lib/utils";

/** Tres planes (Ley de Hick), el del medio resaltado. Toggle mensual / trimestral. */
export function Pricing() {
  const [billing, setBilling] = useState<"mensual" | "trimestral">("mensual");

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Forma de pago" className="inline-flex rounded-full border border-border bg-surface p-1">
          {(["mensual", "trimestral"] as const).map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={billing === b}
              onClick={() => setBilling(b)}
              className={cn(
                "min-h-11 rounded-full px-5 text-sm font-semibold capitalize transition-colors",
                billing === b ? "bg-cta text-cta-fg" : "text-muted hover:text-fg",
              )}
            >
              {b}
              {b === "trimestral" ? <span className="ml-1.5 text-xs">(−10 %)</span> : null}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-12 grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {plans.map((p) => {
          const monthly = billing === "mensual" ? p.monthly : Math.round((p.monthly * (1 - QUARTERLY_DISCOUNT)) / 1000) * 1000;
          return (
            <li
              key={p.id}
              className={cn(
                "card relative flex flex-col p-7 md:p-8",
                p.highlighted && "border-2 border-accent shadow-lift lg:-my-4 lg:py-12",
              )}
            >
              {p.highlighted ? (
                <p className="absolute -top-3.5 left-7 rounded-full bg-cta px-3 py-1 text-xs font-bold uppercase tracking-wider text-cta-fg">Recomendado</p>
              ) : null}
              <h3 className="text-h3 font-bold">{p.name}</h3>
              <p className="mt-2 min-h-12 text-muted">{p.forWho}</p>
              {/* Ley de Proximidad: precio junto al plan y a lo que incluye. */}
              <p className="mt-6">
                <span className="text-sm text-muted">Desde </span>
                <span className="font-sans text-4xl font-semibold">{formatCOP(monthly)}</span>
                <span className="text-muted"> /mes</span>
              </p>
              <p className="mt-1 min-h-5 text-sm text-muted">
                {billing === "trimestral" ? `Facturado cada 3 meses: ${formatCOP(monthly * 3)}` : "Sin permanencia · cancela con 30 días de aviso"}
              </p>
              <ul className="mt-7 space-y-3">
                {p.includes.map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <ButtonLink
                  href={`/contacto?plan=${p.id}`}
                  variant={p.highlighted ? "primary" : "secondary"}
                  className="w-full"
                  aria-label={`Agenda una asesoría gratuita para el plan ${p.name}`}
                >
                  Agenda una asesoría gratuita
                </ButtonLink>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
