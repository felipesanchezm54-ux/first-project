import { chartColors } from "@/lib/chart-palette";
import { CountUp } from "@/components/motion/count-up";

// Vista previa del panel en el inicio. Datos de demostración (mismos del seed).
const weeks = [51, 54, 56, 56, 60, 57, 65, 66, 65, 66, 73, 73];
const max = Math.max(...weeks);

export function DashboardPreview() {
  return (
    <figure data-tone="light" className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface p-5 text-fg shadow-lift md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Panel de resultados · Tienda Óptica</p>
          <p className="font-display text-lg font-semibold">Últimas 12 semanas</p>
        </div>
        <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold">Datos de demostración</span>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Leads del mes", value: 277 },
          { label: "Apertura email", value: 48, suffix: " %" },
          { label: "Clics a WhatsApp", value: 807 },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-surface-2 p-3 md:p-4">
            <dt className="text-xs text-muted md:text-sm">{k.label}</dt>
            <dd className="mt-1 font-sans text-xl font-semibold md:text-3xl">
              <CountUp value={k.value} suffix={k.suffix} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <p className="text-sm font-semibold">Leads por semana</p>
        <div className="mt-3 flex h-36 items-end gap-[2px] border-b pb-px" style={{ borderColor: chartColors.grid }}>
          {weeks.map((v, i) => (
            <div key={i} className="flex h-full flex-1 items-end justify-center">
              <div
                className="anim-bar w-full max-w-6 rounded-t-[4px]"
                style={{ height: `${(v / max) * 100}%`, background: chartColors.single, animationDelay: `${i * 60}ms` }}
                title={`Semana ${i + 1}: ${v} leads`}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 flex justify-between text-xs text-muted">
          <span>Sem. 1</span>
          <span>Sem. 12 · 73 leads</span>
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">Avance hacia la meta de +20 % en conversión</span>
          <span className="font-semibold">89 %</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: "#d7ece4" }} role="img" aria-label="Avance de 89 % hacia la meta: +17,9 % de +20 %">
          <div className="h-full rounded-full" style={{ width: "89%", background: chartColors.single }} />
        </div>
        <p className="mt-2 text-xs text-muted">+17,9 % de +20 % · mes 5 de 6</p>
      </div>
      <figcaption className="sr-only">
        Vista previa del panel: 277 leads en el mes, 48 % de apertura de email, 807 clics a WhatsApp y 89 % de avance hacia la meta. Datos de
        demostración.
      </figcaption>
    </figure>
  );
}
