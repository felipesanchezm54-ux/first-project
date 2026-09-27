"use client";

import { useEffect, useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Pila de botones flotantes abajo a la derecha (zona del pulgar, Ley de Fitts):
 * WhatsApp arriba y Vera abajo, sin superponerse. En móvil se ocultan mientras el
 * usuario escribe en un formulario para no tapar campos ni el botón de enviar,
 * y suben cuando el aviso de cookies está visible.
 */
export function FloatingActions({ children }: { children?: ReactNode }) {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.closest("form") !== null && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && !el.closest("[data-vera]");
    const onIn = (e: FocusEvent) => setTyping(isField(e.target) && window.innerWidth < 768);
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-3 transition-[opacity,transform] duration-200 md:right-6",
        typing && "pointer-events-none translate-y-4 opacity-0",
      )}
      style={{ bottom: "calc(1rem + var(--cookie-h, 0px) + env(safe-area-inset-bottom, 0px))" }}
    >
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir a NEXO por WhatsApp (se abre en una pestaña nueva)"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#062a17] shadow-lift transition-transform hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      {children}
    </div>
  );
}
