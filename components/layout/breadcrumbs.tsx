import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export type Crumb = { name: string; path: string };

/** Breadcrumbs visibles + BreadcrumbList en JSON-LD. El último ítem es la página actual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Ruta de navegación" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="inline-flex min-h-8 items-center underline-offset-4 hover:text-accent hover:underline">
                      {item.name}
                    </Link>
                    <ChevronRight aria-hidden className="h-3.5 w-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
