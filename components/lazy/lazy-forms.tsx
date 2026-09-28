"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { useNearViewport } from "@/components/lazy/use-near-viewport";

/**
 * Los formularios con React Hook Form + Zod se descargan solo cuando están por
 * entrar en pantalla: así esas librerías no compiten con el primer render (mejora LCP).
 * El espacio queda reservado para no provocar saltos de diseño (CLS).
 */
const NewsletterForm = dynamic(() => import("@/components/forms/newsletter-form").then((m) => m.NewsletterForm), { ssr: false });
const QuickLeadForm = dynamic(() => import("@/components/forms/quick-lead-form").then((m) => m.QuickLeadForm), { ssr: false });

export function LazyNewsletterForm(props: ComponentProps<typeof NewsletterForm>) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  return (
    <div ref={ref} className="min-h-[7.5rem]">
      {near ? <NewsletterForm {...props} /> : null}
    </div>
  );
}

export function LazyQuickLeadForm() {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  return (
    <div ref={ref} className="min-h-[16rem]">
      {near ? <QuickLeadForm /> : null}
    </div>
  );
}
