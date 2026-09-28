import { Bot } from "lucide-react";
import type { TeamMember } from "@/lib/content/company";
import { cn } from "@/lib/utils";

const ring = { green: "from-[#1f9e75] to-[#085042]", teal: "from-[#3dd9a4] to-[#1f9e75]", purple: "from-[#a8a2f2] to-[#5047bf]" };

/** Tarjeta de equipo. El contenido está siempre visible; el hover solo añade elevación y brillo. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="card group relative h-full overflow-hidden p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div
        aria-hidden
        className={cn("absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-50", ring[member.color])}
      />
      <div className="relative flex items-center gap-4">
        <span
          aria-hidden
          className={cn(
            "inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br font-display text-xl font-bold text-white transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105",
            ring[member.color],
          )}
        >
          {member.isAI ? <Bot className="h-8 w-8" /> : member.initials}
        </span>
        <div>
          <h3 className="text-xl font-semibold">{member.name}</h3>
          <p className="text-sm font-semibold text-accent">{member.role}</p>
        </div>
      </div>
      <p className="relative mt-5 text-sm font-semibold">{member.specialty}</p>
      <p className="relative mt-2 text-muted">{member.bio}</p>
      {member.isAI ? (
        <p className="relative mt-4 inline-flex rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">Agente de inteligencia artificial</p>
      ) : null}
    </article>
  );
}
