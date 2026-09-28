"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { Bot, LoaderCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string; links?: { label: string; href: string }[] };

const SUGGESTED = [
  "¿Qué servicios ofrecen?",
  "¿Cuánto cuestan los planes?",
  "Cuéntame el caso de Tienda Óptica",
  "Quiero agendar una asesoría",
];

const GREETING: Msg = {
  role: "assistant",
  content: "¡Hola! Soy Vera, la agente de IA de NEXO. Te ayudo con servicios, planes, casos o a agendar una asesoría gratuita. ¿Qué quieres saber?",
};

/** Widget de chat de Vera. Botón flotante + panel accesible (Radix Dialog: foco atrapado, Esc para cerrar). */
export function VeraWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // Se envía la conversación sin el saludo inicial (debe empezar con el usuario) y limitada a los últimos 10 turnos.
      const history = next.filter((m) => m !== GREETING).slice(-10).map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/vera", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? "No pude responder ahora.");
      setMessages((m) => [...m, { role: "assistant", content: data.reply, links: data.links }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `${e instanceof Error ? e.message : "No pude responder ahora."} Puedes escribirle al equipo en el formulario de contacto.`, links: [{ label: "Ir a contacto", href: "/contacto" }] },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const userHasAsked = messages.some((m) => m.role === "user");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="group inline-flex h-14 items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--brand-purple),#5047bf)] pl-4 pr-5 font-display font-semibold text-white shadow-lift transition-transform hover:-translate-y-0.5"
        aria-label="Abrir chat con Vera, agente de IA de NEXO"
      >
        <Bot aria-hidden className="h-6 w-6" />
        <span>Vera</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          data-vera
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className="fixed inset-0 z-[80] flex flex-col bg-[var(--night-2)] text-fg shadow-lift sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[36rem] sm:max-h-[calc(100vh-3rem)] sm:w-[24rem] sm:rounded-[var(--r-card)] sm:border sm:border-border"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(120deg,var(--brand-purple),#5047bf)] text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <Dialog.Title className="font-display font-semibold">Vera</Dialog.Title>
                <Dialog.Description className="text-xs text-muted">Agente de IA de NEXO · Estratega de Datos e Insights</Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:border-accent" aria-label="Cerrar chat">
              <X aria-hidden className="h-5 w-5" />
            </Dialog.Close>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                <p className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.role === "user" ? "rounded-br-md bg-cta text-cta-fg" : "rounded-bl-md bg-[var(--night-3)]")}>
                  <span className="sr-only">{m.role === "user" ? "Tú: " : "Vera: "}</span>
                  {m.content}
                </p>
                {m.links?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.links.map((l) =>
                      l.href.startsWith("http") ? (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-accent px-4 text-xs font-semibold text-accent">
                          {l.label}
                        </a>
                      ) : (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center rounded-full border border-accent px-4 text-xs font-semibold text-accent">
                          {l.label}
                        </Link>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            ))}
            {loading ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> Vera está escribiendo…
              </p>
            ) : null}
            {!userHasAsked ? (
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Preguntas sugeridas</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {SUGGESTED.map((q) => (
                    <li key={q}>
                      <button type="button" onClick={() => send(q)} className="min-h-11 w-full rounded-xl border border-border px-4 py-2 text-left text-sm hover:border-accent hover:text-accent">
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <form
            data-vera
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="vera-input" className="sr-only">
              Escribe tu pregunta para Vera
            </label>
            <input
              id="vera-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              autoComplete="off"
              placeholder="Escribe tu pregunta…"
              className="min-h-12 flex-1 rounded-full border border-border bg-[var(--night)] px-4 text-sm text-fg placeholder:text-muted focus:border-accent"
            />
            <button type="submit" disabled={loading || !input.trim()} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cta text-cta-fg disabled:opacity-50" aria-label="Enviar pregunta">
              <Send aria-hidden className="h-5 w-5" />
            </button>
          </form>
          <p className="px-5 pb-3 text-[0.7rem] text-muted">Vera es una IA y puede equivocarse. No compartas datos personales en el chat.</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
