"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function format(n: number, decimals: number) {
  return new Intl.NumberFormat("es-CO", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}

/**
 * Contador que sube al entrar en pantalla. El HTML del servidor trae el valor
 * final (lo que leen Google y los lectores de pantalla); la animación es solo visual.
 */
export function CountUp({ value, prefix = "", suffix = "", decimals, className }: { value: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const d = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(format(value, d));
  const started = useRef(false);

  useEffect(() => {
    if (reduce || started.current) return;
    if (!inView) {
      setDisplay(format(0, d));
      return;
    }
    started.current = true;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(format(v, d)),
    });
    return () => {
      // Si el efecto se reinicia (p. ej. useReducedMotion pasa de null a false), se vuelve a animar.
      controls.stop();
      started.current = false;
    };
  }, [inView, reduce, value, d]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(value, d)}
        {suffix}
      </span>
    </span>
  );
}
