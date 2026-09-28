"use client";

import { m, useScroll, useSpring } from "framer-motion";

/** Ley de Zeigarnik: barra de progreso de lectura bajo el header. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden
      className="fixed inset-x-0 top-[var(--header-h)] z-40 h-1 origin-left bg-[linear-gradient(90deg,var(--teal-electric),var(--purple-soft))]"
      style={{ scaleX }}
    />
  );
}
