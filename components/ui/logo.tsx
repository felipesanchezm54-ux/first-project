import { cn } from "@/lib/utils";

/**
 * Isotipo de NEXO redibujado en SVG a partir de assets/logo-nexo.png:
 * tres nodos (verde #085042, teal #1F9E75, morado #7F77DC) unidos en triángulo.
 * En fondos oscuros el nodo y las líneas verde oscuro pasan a claro para
 * mantener contraste (versión en negativo).
 */
export function LogoMark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const ink = tone === "dark" ? "#E6F2ED" : "#085042";
  return (
    <svg viewBox="0 0 124 124" className={cn("h-8 w-8", className)} aria-hidden="true" focusable="false">
      <g stroke={ink} strokeWidth="7" strokeLinecap="round">
        <line x1="26" y1="26" x2="98" y2="26" />
        <line x1="26" y1="26" x2="62" y2="98" />
        <line x1="98" y1="26" x2="62" y2="98" />
      </g>
      <circle cx="26" cy="26" r="24" fill={tone === "dark" ? "#E6F2ED" : "#085042"} />
      <circle cx="98" cy="26" r="24" fill="#1F9E75" />
      <circle cx="62" cy="98" r="24" fill="#7F77DC" />
    </svg>
  );
}

export function Logo({ className, tone = "dark", showTagline = false }: { className?: string; tone?: "dark" | "light"; showTagline?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-sans text-[1.7rem] font-medium tracking-[-0.03em]", tone === "dark" ? "text-fg" : "text-brand-green")}>
          nexo
        </span>
        {showTagline && (
          <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted">Agencia de marketing digital</span>
        )}
      </span>
    </span>
  );
}
