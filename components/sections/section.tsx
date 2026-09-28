import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Sección con tono claro u oscuro. El ritmo claro/oscuro se da alternando `tone`. */
export function Section({
  children,
  tone = "dark",
  id,
  className,
  labelledBy,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} data-tone={tone} aria-labelledby={labelledBy} className={cn("relative py-20 md:py-28", className)}>
      <div className="container-nexo">{children}</div>
    </section>
  );
}

/**
 * Encabezado de sección: eyebrow + H2 + respuesta directa (AEO).
 * La respuesta va justo debajo del H2, en 40–60 palabras, para que sea citable.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  answer,
  align = "left",
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  answer?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="mt-3 text-h2 font-bold">
        {title}
      </h2>
      {answer ? <p className="mt-5 text-lead text-muted">{answer}</p> : null}
    </div>
  );
}
