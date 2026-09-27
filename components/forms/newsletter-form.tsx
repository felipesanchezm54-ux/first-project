"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/schemas";
import { Honeypot, inputClasses } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function NewsletterForm({ source, className, labelledBy }: { source: string; className?: string; labelledBy?: string }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const id = `newsletter-${source}`;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { correo: "", consentimiento: false, origen: source, website: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? "No pudimos suscribirte. Intenta de nuevo en un minuto.");
      setStatus("ok");
      setServerMessage(data?.message ?? "¡Listo! Te llegará el próximo boletín.");
      reset({ correo: "", consentimiento: false, origen: source, website: "" });
    } catch (e) {
      setStatus("error");
      setServerMessage(e instanceof Error ? e.message : "No pudimos suscribirte.");
    }
  });

  const error = errors.correo?.message ?? errors.consentimiento?.message;

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={labelledBy} className={cn("relative", className)}>
      <Honeypot register={register} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-correo`} className="sr-only">
          Correo electrónico
        </label>
        <input
          id={`${id}-correo`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@empresa.com"
          aria-invalid={errors.correo ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClasses}
          {...register("correo")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-cta px-5 font-display font-semibold text-cta-fg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {isSubmitting ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : <Send aria-hidden className="h-4 w-4" />}
          {isSubmitting ? "Enviando…" : "Suscribirme"}
        </button>
      </div>
      <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--c-accent)]"
          aria-invalid={errors.consentimiento ? true : undefined}
          {...register("consentimiento")}
        />
        <span>
          Acepto recibir el boletín y la{" "}
          <Link href="/privacidad" className="link">
            política de privacidad
          </Link>
          .
        </span>
      </label>
      <div aria-live="polite" className="mt-2 min-h-5 text-sm">
        {error ? (
          <p id={`${id}-error`} className="font-medium text-danger">
            {error}
          </p>
        ) : status === "ok" ? (
          <p className="flex items-center gap-1.5 font-medium text-success">
            <CircleCheck aria-hidden className="h-4 w-4" /> {serverMessage}
          </p>
        ) : status === "error" ? (
          <p className="font-medium text-danger">{serverMessage}</p>
        ) : null}
      </div>
    </form>
  );
}
