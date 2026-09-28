import { Quote } from "lucide-react";
import { testimonials } from "@/lib/content/cases";
import { Reveal } from "@/components/motion/reveal";

export function Testimonials({ layout = "row" }: { layout?: "row" | "stack" }) {
  return (
    <ul className={layout === "row" ? "grid gap-5 md:grid-cols-3" : "grid gap-4"}>
      {testimonials.map((t, i) => (
        <Reveal as="li" key={t.quote} delay={i * 0.08} className="card flex flex-col p-7">
          <Quote aria-hidden className="h-7 w-7 text-accent-2" />
          <blockquote className="mt-4 text-lg leading-relaxed">“{t.quote}”</blockquote>
          <div className="mt-auto pt-6">
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm text-muted">{t.role}</p>
            <p className="mt-3 inline-flex rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">Testimonio ilustrativo</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
