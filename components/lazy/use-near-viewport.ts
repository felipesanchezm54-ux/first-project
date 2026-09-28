"use client";

import { useEffect, useRef, useState } from "react";

/**
 * true cuando el elemento está a menos de `margin` de la ventana, cuando recibe foco/toque
 * o, como respaldo, en el primer momento ocioso después de que la página terminó de cargar
 * (fuera del camino crítico del LCP, pero garantiza que el formulario siempre quede disponible).
 */
export function useNearViewport<T extends HTMLElement>(margin = "400px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: margin });
    io.observe(el);
    const wake = () => setNear(true);
    el.addEventListener("focusin", wake);
    el.addEventListener("pointerdown", wake);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const idle = () => {
      timer = setTimeout(() => ("requestIdleCallback" in window ? window.requestIdleCallback(wake, { timeout: 2000 }) : wake()), 1500);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      io.disconnect();
      clearTimeout(timer);
      window.removeEventListener("load", idle);
      el.removeEventListener("focusin", wake);
      el.removeEventListener("pointerdown", wake);
    };
  }, [margin, near]);
  return [ref, near] as const;
}
