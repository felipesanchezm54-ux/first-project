import { CountUp } from "@/components/motion/count-up";
import type { Metric } from "@/lib/content/cases";

/** Ley de Proximidad: cada cifra va pegada a su etiqueta y a su contexto. */
export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="card flex flex-col p-6">
          <dt className="order-2 mt-3 font-semibold">{m.label}</dt>
          <dd className="order-1 font-sans text-[clamp(2.4rem,2rem+1.5vw,3.25rem)] font-semibold leading-none text-accent">
            <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} />
          </dd>
          <dd className="order-3 mt-1 text-sm text-muted">{m.context}</dd>
        </div>
      ))}
    </dl>
  );
}
