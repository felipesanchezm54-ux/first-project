import { Glasses } from "lucide-react";

/** Marca de referencia de Tienda Óptica (versión simplificada para el sitio de NEXO). */
export function TiendaOpticaMark() {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3" role="img" aria-label="Logo de Tienda Óptica">
      <Glasses aria-hidden className="h-6 w-6 text-accent-2" />
      <span className="font-display text-base font-semibold leading-none">
        Tienda
        <br />
        Óptica
      </span>
    </span>
  );
}
