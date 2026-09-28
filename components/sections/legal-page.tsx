import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { formatDate } from "@/lib/utils";

export function LegalPage({ title, path, updatedAt, children }: { title: string; path: string; updatedAt: string; children: ReactNode }) {
  return (
    <>
      <header className="grain pb-12 pt-[calc(var(--header-h)+2rem)]">
        <div className="container-nexo">
          <Breadcrumbs items={[{ name: title, path }]} />
          <h1 className="mt-10 text-h1 font-bold">{title}</h1>
          <p className="mt-4 text-muted">
            Última actualización: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </p>
        </div>
      </header>
      <div data-tone="light" className="py-16">
        <div className="container-nexo">
          <div className="prose-nexo max-w-[72ch] [&_h2+p]:border-0 [&_h2+p]:pl-0 [&_h2+p]:text-[1.075rem]">{children}</div>
        </div>
      </div>
    </>
  );
}
