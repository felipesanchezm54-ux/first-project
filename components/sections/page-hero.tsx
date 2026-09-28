import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";

/** Encabezado de páginas internas: breadcrumbs + H1 único con la keyword + entradilla. */
export function PageHero({ crumbs, eyebrow, title, lead, children }: { crumbs: Crumb[]; eyebrow: string; title: ReactNode; lead: ReactNode; children?: ReactNode }) {
  return (
    <section className="grain relative overflow-hidden pb-16 pt-[calc(var(--header-h)+2rem)] md:pb-24">
      <div className="container-nexo">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-10">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-h1 font-bold">{title}</h1>
        <div className="mt-6 max-w-2xl text-lead text-muted">{lead}</div>
        {children}
      </div>
    </section>
  );
}
