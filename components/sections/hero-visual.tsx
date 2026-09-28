/**
 * Composición animada del hero: los canales (web, redes, WhatsApp, email y
 * tienda) alimentan el "nexo" central. Es decorativa (aria-hidden); la misma
 * idea se explica en texto en /servicios#omnicanalidad.
 */
const channels = [
  { label: "Web", x: 70, y: 110 },
  { label: "Instagram", x: 440, y: 90 },
  { label: "WhatsApp", x: 470, y: 330 },
  { label: "Email", x: 60, y: 360 },
  { label: "Tienda", x: 265, y: 480 },
];

const hub = { a: { x: 215, y: 215 }, b: { x: 315, y: 215 }, c: { x: 265, y: 305 } };

export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[34rem] select-none">
      <svg viewBox="0 0 540 540" className="h-full w-full">
        <defs>
          <radialGradient id="glow" cx="50%" cy="48%" r="50%">
            <stop offset="0%" stopColor="#1f9e75" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#03201a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="265" cy="245" r="250" fill="url(#glow)" />
        <circle cx="265" cy="245" r="190" fill="none" stroke="#e6f2ed" strokeOpacity="0.08" />
        <circle cx="265" cy="245" r="120" fill="none" stroke="#e6f2ed" strokeOpacity="0.06" />

        {channels.map((c, i) => {
          const target = [hub.a, hub.b, hub.b, hub.a, hub.c][i];
          return (
            <g key={c.label}>
              <line x1={c.x} y1={c.y} x2={target.x} y2={target.y} stroke={i % 2 ? "#a8a2f2" : "#3dd9a4"} strokeOpacity="0.7" strokeWidth="2" className="anim-flow" style={{ animationDelay: `${i * -0.3}s` }} />
              <circle cx={c.x} cy={c.y} r="16" fill={i % 2 ? "#a8a2f2" : "#3dd9a4"} className="anim-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
              <circle cx={c.x} cy={c.y} r="14" fill="#0f3a30" stroke={i % 2 ? "#a8a2f2" : "#3dd9a4"} strokeWidth="2" />
              <text x={c.x} y={c.y + 36} textAnchor="middle" fill="#a3bfb4" fontSize="15" fontFamily="var(--font-inter)">
                {c.label}
              </text>
            </g>
          );
        })}

        <g className="anim-float">
          <g stroke="#e6f2ed" strokeWidth="8" strokeLinecap="round">
            <line x1={hub.a.x} y1={hub.a.y} x2={hub.b.x} y2={hub.b.y} />
            <line x1={hub.a.x} y1={hub.a.y} x2={hub.c.x} y2={hub.c.y} />
            <line x1={hub.b.x} y1={hub.b.y} x2={hub.c.x} y2={hub.c.y} />
          </g>
          <circle cx={hub.a.x} cy={hub.a.y} r="32" fill="#e6f2ed" />
          <circle cx={hub.b.x} cy={hub.b.y} r="32" fill="#1f9e75" />
          <circle cx={hub.c.x} cy={hub.c.y} r="32" fill="#7f77dc" />
        </g>
      </svg>

      <div className="anim-float-slow absolute left-0 top-[4%] rounded-2xl border border-border bg-[var(--night-2)]/90 px-4 py-3 shadow-lift backdrop-blur md:-left-4">
        <p className="text-xs text-muted">Conversión digital</p>
        <p className="font-display text-2xl font-bold text-accent">+17,8 %</p>
      </div>
      <div className="anim-float absolute bottom-[12%] right-0 rounded-2xl border border-border bg-[var(--night-2)]/90 px-4 py-3 shadow-lift backdrop-blur md:-right-4">
        <p className="text-xs text-muted">Costo por lead</p>
        <p className="font-display text-2xl font-bold text-accent-2">−32 %</p>
      </div>
    </div>
  );
}
