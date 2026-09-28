"use client";

import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/content/faqs";

/** Acordeón accesible (Radix): teclado, aria-expanded y aria-controls incluidos. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="faq-0" className="divide-y divide-border rounded-[var(--r-card)] border border-border bg-surface">
      {faqs.map((f, i) => (
        <Accordion.Item key={f.question} value={`faq-${i}`}>
          <Accordion.Header asChild>
            <h3>
              <Accordion.Trigger className="group flex min-h-16 w-full items-center justify-between gap-4 px-6 py-4 text-left font-display text-lg font-semibold hover:text-accent">
                {f.question}
                <ChevronDown aria-hidden className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          {/* forceMount: la respuesta está en el HTML aunque esté cerrada (rastreable y coincide con FAQPage). */}
          <Accordion.Content forceMount className="px-6 pb-5 text-muted data-[state=closed]:hidden">
            {f.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
