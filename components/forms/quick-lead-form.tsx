"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import { quickLeadSchema, serviceOptions, type QuickLeadInput } from "@/lib/schemas";
import { Field, Honeypot, inputClasses, describedBy } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

/** Formulario corto del inicio: correo + servicio. El resto lo completa el equipo al responder (Ley de Tesler). */
export function QuickLeadForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuickLeadInput>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: { correo: "", servicio: "", habeasData: false, website: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, tipo: "rapido", origen: "inicio" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? "No pudimos enviar tu solicitud. Intenta de nuevo.");
      setStatus("ok");
      setMsg(data?.message ?? "¡Mensaje enviado! Te contactamos en menos de 24 horas hábiles.");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "No pudimos enviar tu solicitud.");
    }
  });

  if (status === "ok") {
    return (
      <div role="status" className="rounded-2xl bg-white/10 p-6 text-white">
        <p className="flex items-center gap-2 font-display text-xl font-semibold">
          <CircleCheck aria-hidden className="h-6 w-6 text-[var(--teal-electric)]" /> {msg}
        </p>
        <p className="mt-2 text-[#d8ece4]">
          Si quieres adelantar, cuéntanos más en el{" "}
          <Link href="/contacto" className="underline underline-offset-4">
            formulario completo
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-4 text-white [--c-fg:#ffffff] [--c-muted:#d8ece4] [--c-danger:#ffc2c2]" aria-label="Solicitud rápida de asesoría">
      <Honeypot register={register} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="rapido-correo" label="Correo de trabajo" error={errors.correo?.message}>
          <input
            id="rapido-correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@empresa.com"
            aria-invalid={errors.correo ? true : undefined}
            aria-describedby={describedBy("rapido-correo", errors.correo?.message)}
            className={`${inputClasses} border-white/30 bg-white/10 text-white placeholder:text-white/60`}
            {...register("correo")}
          />
        </Field>
        <Field id="rapido-servicio" label="¿Qué necesitas?" error={errors.servicio?.message}>
          <select
            id="rapido-servicio"
            aria-invalid={errors.servicio ? true : undefined}
            aria-describedby={describedBy("rapido-servicio", errors.servicio?.message)}
            className={`${inputClasses} border-white/30 bg-white/10 text-white [&>option]:text-[#06231c]`}
            {...register("servicio")}
          >
            <option value="">Elige un servicio</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <label className="flex items-start gap-3 text-sm text-[#d8ece4]">
        <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--teal-electric)]" aria-invalid={errors.habeasData ? true : undefined} {...register("habeasData")} />
        <span>
          Autorizo a NEXO a tratar mis datos para responder esta solicitud, según la{" "}
          <Link href="/privacidad" className="underline underline-offset-4">
            política de privacidad
          </Link>{" "}
          (Ley 1581 de 2012).
        </span>
      </label>
      <div aria-live="polite">
        {errors.habeasData ? <p className="text-sm font-medium text-[#ffc2c2]">{errors.habeasData.message}</p> : null}
        {status === "error" ? <p className="text-sm font-medium text-[#ffc2c2]">{msg}</p> : null}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto md:justify-self-start">
        {isSubmitting ? <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" /> : null}
        {isSubmitting ? "Enviando…" : "Quiero mi asesoría gratuita"}
        {!isSubmitting ? <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" /> : null}
      </Button>
    </form>
  );
}
