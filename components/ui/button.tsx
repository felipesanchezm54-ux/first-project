import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight transition-[transform,background-color,box-shadow,color] duration-200 ease-out select-none disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Ley de Semejanza: un único estilo de botón primario en todo el sitio.
 * Ley de Fitts: altura mínima de 48 px (md) o 56 px (lg).
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-cta text-cta-fg shadow-[0_10px_30px_-12px_rgb(61_217_164/0.7)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgb(61_217_164/0.85)] active:translate-y-0",
  secondary: "border border-fg/25 text-fg hover:border-accent hover:text-accent",
  ghost: "text-fg hover:text-accent underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-lg",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function buttonClasses({ variant = "primary", size = "md", className }: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, ...props }: CommonProps & ComponentProps<"button">) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  href,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "className">) {
  const isExternal = typeof href === "string" && /^https?:/.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses({ variant, size, className })}
        {...(props as ComponentProps<"a">)}
      />
    );
  }
  return <Link href={href} className={buttonClasses({ variant, size, className })} {...props} />;
}
