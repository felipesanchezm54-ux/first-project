"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Dialog, Switch } from "radix-ui";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = readConsent();
    if (!current) setVisible(true);
    else {
      setAnalytics(current.analytics);
      setMarketing(current.marketing);
    }
    const open = () => setSettingsOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  // Publica la altura del banner para que los botones flotantes no queden tapados.
  useEffect(() => {
    const root = document.documentElement;
    if (!visible || !ref.current) {
      root.style.setProperty("--cookie-h", "0px");
      return;
    }
    const ro = new ResizeObserver(([entry]) => root.style.setProperty("--cookie-h", `${entry.target.getBoundingClientRect().height}px`));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [visible]);

  const decide = (value: { analytics: boolean; marketing: boolean }) => {
    saveConsent(value);
    setAnalytics(value.analytics);
    setMarketing(value.marketing);
    setVisible(false);
    setSettingsOpen(false);
  };

  return (
    <>
      {visible && (
        <div
          ref={ref}
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-[var(--night-2)] text-fg shadow-lift"
        >
          <div className="container-nexo flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <p className="flex gap-3 text-sm text-muted">
              <Cookie aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span>
                Usamos cookies propias para que el sitio funcione y, solo si aceptas, cookies de analítica (Google Analytics 4) y de
                marketing (Meta Pixel). Detalles en la{" "}
                <Link href="/cookies" className="link">
                  política de cookies
                </Link>
                .
              </span>
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="ghost" className="min-h-11 px-4 text-sm" onClick={() => setSettingsOpen(true)}>
                Configurar
              </Button>
              <Button variant="secondary" className="min-h-11 px-4 text-sm" onClick={() => decide({ analytics: false, marketing: false })}>
                Rechazar
              </Button>
              <Button className="min-h-11 px-5 text-sm" onClick={() => decide({ analytics: true, marketing: true })}>
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-night/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-card)] border border-border bg-[var(--night-2)] p-6 text-fg shadow-lift">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="font-display text-xl font-semibold">Preferencias de cookies</Dialog.Title>
              <Dialog.Close aria-label="Cerrar" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border">
                <X aria-hidden className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-2 text-sm text-muted">
              Puedes cambiar esta decisión cuando quieras desde el enlace “Cookies” del pie de página.
            </Dialog.Description>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">Necesarias</p>
                  <p className="text-sm text-muted">Sesión del panel y tu elección de cookies. Siempre activas.</p>
                </div>
                <span className="text-sm font-semibold text-accent">Activas</span>
              </li>
              {[
                { id: "analytics", label: "Analítica", body: "Google Analytics 4: páginas vistas y rendimiento, sin datos personales.", value: analytics, set: setAnalytics },
                { id: "marketing", label: "Marketing", body: "Meta Pixel: medir anuncios y mostrar publicidad relevante.", value: marketing, set: setMarketing },
              ].map((row) => (
                <li key={row.id} className="flex items-start justify-between gap-4">
                  <div>
                    <label htmlFor={`cookie-${row.id}`} className="font-semibold">
                      {row.label}
                    </label>
                    <p id={`cookie-${row.id}-desc`} className="text-sm text-muted">
                      {row.body}
                    </p>
                  </div>
                  <Switch.Root
                    id={`cookie-${row.id}`}
                    checked={row.value}
                    onCheckedChange={row.set}
                    aria-describedby={`cookie-${row.id}-desc`}
                    className="relative h-7 w-12 shrink-0 rounded-full border border-border bg-[var(--night-3)] transition-colors data-[state=checked]:bg-cta"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-1 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-night" />
                  </Switch.Root>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap justify-end gap-2">
              <Button variant="secondary" className="min-h-11 text-sm" onClick={() => decide({ analytics: false, marketing: false })}>
                Rechazar todas
              </Button>
              <Button className="min-h-11 text-sm" onClick={() => decide({ analytics, marketing })}>
                Guardar preferencias
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
