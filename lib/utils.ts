import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Formatea números con convenciones de Colombia (punto de miles, coma decimal). */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("es-CO", options).format(value);
}

export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota" }).format(
    new Date(date),
  );
}
