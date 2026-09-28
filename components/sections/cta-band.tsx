import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/** Bloque final de alto contraste. Un solo CTA primario (Ley de Hick). */
export function CtaBand({
  id,
  title,
  body,
  cta,
  href,
  secondary,
}: {
  id: string;
  title: ReactNode;
  body: ReactNode;
  cta: string;
  href: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <section aria-labelledby={id} className="relative overflow-hidden py-20 md:py-24">
      <div className="container-nexo">
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,var(--brand-green)_0%,#0b5d4b_45%,#3d3794_100%)] px-6 py-14 md:px-16 md:py-20">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-purple/40 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand-teal/40 blur-3xl" />
          <div className="relative max-w-3xl">
            <h2 id={id} className="text-h2 font-bold text-white">
              {title}
            </h2>
            <p className="mt-5 text-lead text-[#d8ece4]">{body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href={href} size="lg">
                {cta}
                <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              {secondary ? (
                <ButtonLink href={secondary.href} variant="ghost" className="text-white">
                  {secondary.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
