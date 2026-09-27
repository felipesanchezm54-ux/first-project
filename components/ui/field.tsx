import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ley de Proximidad: etiqueta, campo, ayuda y error van juntos en el mismo bloque.
 * El error se anuncia a lectores de pantalla (role="alert" dentro de aria-live).
 */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(opcional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div aria-live="polite">
        {error ? (
          <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-medium text-danger">
            <CircleAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export const inputClasses =
  "min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-fg placeholder:text-muted/80 transition-colors hover:border-fg/40 focus:border-accent focus-visible:outline-2 aria-[invalid=true]:border-danger";

export function describedBy(id: string, error?: string, hint?: boolean) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

/** Campo trampa para bots. Oculto a personas y a lectores de pantalla. */
export function Honeypot({ register }: { register: (name: "website") => object }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Sitio web
        <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </label>
    </div>
  );
}
