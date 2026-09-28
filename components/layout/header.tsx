"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavigationMenu, Dialog } from "radix-ui";
import { ChevronDown, LayoutDashboard, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { services } from "@/lib/content/services";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // En el panel el contenido arranca en fondo claro: el header va sólido desde el inicio.
  const solid = scrolled || pathname.startsWith("/panel");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        solid ? "border-b border-border bg-night/90 backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-nexo flex h-[var(--header-h)] items-center justify-between gap-4">
        {/* Ley de Jakob: logo arriba a la izquierda, lleva al inicio. */}
        <Link href="/" aria-label="NEXO, ir al inicio" className="shrink-0 rounded-lg">
          <Logo />
        </Link>

        <NavigationMenu.Root aria-label="Navegación principal" className="relative hidden lg:block" delayDuration={80}>
          <NavigationMenu.List className="flex items-center gap-1">
            {mainNav.map((item) =>
              item.href === "/servicios" ? (
                <NavigationMenu.Item key={item.href}>
                  <NavigationMenu.Trigger
                    className={cn(
                      "group inline-flex min-h-12 items-center gap-1 rounded-full px-3.5 text-[0.95rem] font-medium transition-colors hover:text-accent",
                      isActive(pathname, item.href) ? "text-accent" : "text-fg",
                    )}
                  >
                    {item.label}
                    <ChevronDown aria-hidden className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="absolute left-1/2 top-full w-[40rem] -translate-x-1/2 pt-3">
                    <div className="card grid grid-cols-2 gap-1 p-3 shadow-lift">
                      {services.map((s) => (
                        <NavigationMenu.Link asChild key={s.slug}>
                          <Link
                            href={`/servicios#${s.slug}`}
                            className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2"
                          >
                            <s.icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                            <span>
                              <span className="block font-display font-semibold">{s.title}</span>
                              <span className="mt-0.5 block text-sm leading-snug text-muted">{s.short}</span>
                            </span>
                          </Link>
                        </NavigationMenu.Link>
                      ))}
                      <NavigationMenu.Link asChild>
                        <Link
                          href="/servicios"
                          className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3 text-sm font-semibold hover:text-accent"
                        >
                          Ver todos los servicios con entregables y KPI
                          <ArrowRight aria-hidden className="h-4 w-4" />
                        </Link>
                      </NavigationMenu.Link>
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              ) : (
                <NavigationMenu.Item key={item.href}>
                  <NavigationMenu.Link asChild active={isActive(pathname, item.href)}>
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-12 items-center rounded-full px-3.5 text-[0.95rem] font-medium transition-colors hover:text-accent",
                        isActive(pathname, item.href) ? "text-accent" : "text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ),
            )}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Ley de Jakob: acceso de cliente arriba a la derecha. */}
        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/panel" variant="secondary" className="min-h-11 px-4 text-sm">
            <LayoutDashboard aria-hidden className="h-4 w-4" />
            Panel de clientes
          </ButtonLink>
          <ButtonLink href="/contacto" className="min-h-11 px-5 text-sm">
            Potencia tu marca
          </ButtonLink>
        </div>

        {/* Móvil: menú hamburguesa (patrón conocido). */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-fg lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu aria-hidden className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-night/70 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-night px-5 pb-8 text-fg shadow-lift">
              <div className="flex h-[var(--header-h)] items-center justify-between">
                <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>
                <Dialog.Description className="sr-only">Páginas del sitio de NEXO</Dialog.Description>
                <Logo />
                <Dialog.Close className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border" aria-label="Cerrar menú">
                  <X aria-hidden className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <nav aria-label="Navegación móvil" className="mt-4">
                <ul className="flex flex-col">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(pathname, item.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-14 items-center border-b border-border font-display text-2xl font-semibold",
                          isActive(pathname, item.href) ? "text-accent" : "text-fg",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink href="/contacto" size="lg">
                  Potencia tu marca
                </ButtonLink>
                <ButtonLink href="/panel" variant="secondary">
                  <LayoutDashboard aria-hidden className="h-4 w-4" />
                  Panel de clientes
                </ButtonLink>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
