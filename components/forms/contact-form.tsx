"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { contactSchema, serviceOptions, type ContactInput } from "@/lib/schemas";
import { getPlan, plans } from "@/lib/content/plans";
import { Field, Honeypot, describedBy, inputClasses } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Tus datos", fields: ["nombre", "empresa", "correo", "telefono"] as const },
  { title: "Tu proyecto", fields: ["servicio", "plan", "mensaje", "habeasData", "comercial"] as const },
];

const placeholders: Record<string, string> = {
  "estrategia-de-marketing": "Ej.: Vendemos bien en tienda, pero no sabemos qué canal digital nos trae clientes.",
  "marketing-digital": "Ej.: Queremos una landing y empezar a recolectar correos de clientes.",
  "redes-sociales": "Ej.: Publicamos sin plan y queremos una parrilla mensual con objetivos.",
  "creacion-de-contenido": "Ej.: Necesitamos reels y carruseles que expliquen nuestros productos.",
  "publicidad-digital": "Ej.: Invertimos en Meta Ads, pero no sabemos cuánto nos cuesta cada cliente.",
  "analisis-y-medicion": "Ej.: Queremos un tablero con nuestras ventas por canal.",
};

/**
 * Formulario de contacto en 2 pasos.
 * - Zeigarnik: indicador de progreso "Paso X de 2" y confirmación clara al final.
 * - Tesler: plan y servicio preseleccionados desde la URL, autocompletado del navegador.
 * - Postel: acepta teléfono con o sin +57/espacios y correo en mayúsculas; errores con solución.
 */
export function ContactForm() {
  const params = useSearchParams();
  const initialPlan = getPlan(params.get("plan"))?.id ?? "";
  const initialService = serviceOptions.some((o) => o.value === params.get("servicio")) ? (params.get("servicio") as string) : "";
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      nombre: "",
      empresa: "",
      correo: "",
      telefono: "",
      servicio: (initialService || (initialPlan ? "no-se" : "")) as ContactInput["servicio"],
      plan: initialPlan as ContactInput["plan"],
      mensaje: "",
      habeasData: false,
      comercial: false,
      origen: initialPlan ? `planes-${initialPlan}` : "contacto",
      website: "",
    },
  });

  const servicio = watch("servicio");
  const plan = watch("plan");

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (status === "ok") successRef.current?.focus();
  }, [status]);

  const next = async () => {
    const ok = await trigger([...steps[0].fields]);
    if (ok) setStep(1);
  };

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data?.errors) {
        for (const [k, v] of Object.entries(data.errors as Record<string, string>)) setError(k as keyof ContactInput, { message: v });
        if (steps[0].fields.some((f) => f in data.errors)) setStep(0);
        throw new Error("Revisa los campos marcados.");
      }
      if (!res.ok) throw new Error(data?.message ?? "No pudimos enviar tu mensaje. Intenta de nuevo en un minuto o escríbenos por WhatsApp.");
      setServerMsg(data?.message ?? "¡Mensaje enviado! Te contactamos en menos de 24 horas hábiles.");
      setStatus("ok");
    } catch (e) {
      setServerMsg(e instanceof Error ? e.message : "No pudimos enviar tu mensaje.");
      setStatus("error");
    }
  });

  if (status === "ok") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="card p-8 outline-none md:p-10">
        <CircleCheck aria-hidden className="h-12 w-12 text-success" />
        <h2 className="mt-5 text-h2 font-bold">{serverMsg}</h2>
        <p className="mt-3 text-muted">
          Recibimos tu solicitud y te llegará una copia al correo. Mientras tanto, puedes leer el{" "}
          <Link href="/portafolio/tienda-optica" className="link">
            caso Tienda Óptica
          </Link>{" "}
          o revisar los{" "}
          <Link href="/planes" className="link">
            planes
          </Link>
          .
        </p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className="h-full w-full rounded-full bg-cta" />
        </div>
        <p className="mt-2 text-sm text-muted">Paso 2 de 2 completado</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative p-6 md:p-10" aria-labelledby="form-title">
      <Honeypot register={register} />

      {/* Indicador de progreso */}
      <div>
        <div className="flex items-center justify-between text-sm">
          <p className="font-semibold" aria-live="polite">
            Paso {step + 1} de 2 · {steps[step].title}
          </p>
          <p className="text-muted">{step === 0 ? "Menos de 1 minuto" : "Último paso"}</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Progreso del formulario" aria-valuemin={0} aria-valuemax={2} aria-valuenow={step + 1}>
          <div className="h-full rounded-full bg-cta transition-[width] duration-500" style={{ width: step === 0 ? "50%" : "100%" }} />
        </div>
      </div>

      <h2 id="form-title" ref={headingRef} tabIndex={-1} className="mt-8 text-h3 font-semibold outline-none">
        {step === 0 ? "¿Con quién hablamos?" : "Cuéntanos qué necesitas"}
      </h2>

      {/* Paso 1 · Ley de Miller: campos agrupados por tema */}
      <fieldset className={cn("mt-6 grid gap-5 md:grid-cols-2", step !== 0 && "hidden")}>
        <legend className="sr-only">Tus datos de contacto</legend>
        <Field id="nombre" label="Nombre" error={errors.nombre?.message}>
          <input id="nombre" autoComplete="name" aria-invalid={errors.nombre ? true : undefined} aria-describedby={describedBy("nombre", errors.nombre?.message)} className={inputClasses} {...register("nombre")} />
        </Field>
        <Field id="empresa" label="Empresa o marca" optional error={errors.empresa?.message}>
          <input id="empresa" autoComplete="organization" aria-invalid={errors.empresa ? true : undefined} aria-describedby={describedBy("empresa", errors.empresa?.message)} className={inputClasses} {...register("empresa")} />
        </Field>
        <Field id="correo" label="Correo electrónico" hint="Te respondemos a este correo." error={errors.correo?.message}>
          <input
            id="correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nombre@empresa.com"
            aria-invalid={errors.correo ? true : undefined}
            aria-describedby={describedBy("correo", errors.correo?.message, true)}
            className={inputClasses}
            {...register("correo")}
          />
        </Field>
        <Field id="telefono" label="Teléfono o WhatsApp" optional hint="Con o sin +57, como prefieras." error={errors.telefono?.message}>
          <input
            id="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="300 123 4567"
            aria-invalid={errors.telefono ? true : undefined}
            aria-describedby={describedBy("telefono", errors.telefono?.message, true)}
            className={inputClasses}
            {...register("telefono")}
          />
        </Field>
      </fieldset>

      {/* Paso 2 */}
      <fieldset className={cn("mt-6 grid gap-5 md:grid-cols-2", step !== 1 && "hidden")}>
        <legend className="sr-only">Tu proyecto</legend>
        <Field id="servicio" label="Servicio de interés" error={errors.servicio?.message}>
          <select id="servicio" aria-invalid={errors.servicio ? true : undefined} aria-describedby={describedBy("servicio", errors.servicio?.message)} className={inputClasses} {...register("servicio")}>
            <option value="">Elige una opción</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="plan" label="Plan" optional hint={plan ? "Lo preseleccionamos desde la página de planes." : "Si no sabes, déjalo así: te recomendamos uno."}>
          <select id="plan" aria-describedby="plan-hint" className={inputClasses} {...register("plan")}>
            <option value="">Aún no lo sé</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="mensaje" label="¿Qué quieres lograr?" error={errors.mensaje?.message} className="md:col-span-2" hint="Una o dos frases bastan.">
          <textarea
            id="mensaje"
            rows={5}
            placeholder={placeholders[servicio as string] ?? "Ej.: Queremos más citas desde Instagram en los próximos 3 meses."}
            aria-invalid={errors.mensaje ? true : undefined}
            aria-describedby={describedBy("mensaje", errors.mensaje?.message, true)}
            className={cn(inputClasses, "py-3")}
            {...register("mensaje")}
          />
        </Field>

        <div className="space-y-3 md:col-span-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--c-accent)]"
              aria-invalid={errors.habeasData ? true : undefined}
              aria-describedby={errors.habeasData ? "habeas-error" : undefined}
              {...register("habeasData")}
            />
            <span className="text-sm">
              <strong>Autorizo el tratamiento de mis datos personales</strong> para que NEXO responda esta solicitud, según la{" "}
              <Link href="/privacidad" className="link">
                política de privacidad
              </Link>{" "}
              y la Ley 1581 de 2012 (Habeas Data). <span className="text-muted">(Obligatorio)</span>
            </span>
          </label>
          <div aria-live="polite">
            {errors.habeasData ? (
              <p id="habeas-error" className="text-sm font-medium text-danger">
                {errors.habeasData.message}
              </p>
            ) : null}
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--c-accent)]" {...register("comercial")} />
            <span className="text-sm">
              Quiero recibir comunicaciones comerciales de NEXO (novedades, casos y el boletín). <span className="text-muted">(Opcional)</span>
            </span>
          </label>
        </div>
      </fieldset>

      <div aria-live="assertive" className="mt-4">
        {status === "error" ? <p className="rounded-xl border border-danger/40 p-3 text-sm font-medium text-danger">{serverMsg}</p> : null}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step === 1 ? (
          <Button type="button" variant="ghost" onClick={() => setStep(0)}>
            <ArrowLeft aria-hidden className="h-4 w-4" /> Volver a tus datos
          </Button>
        ) : (
          <span />
        )}
        {step === 0 ? (
          <Button type="button" size="lg" onClick={next}>
            Continuar <ArrowRight aria-hidden className="h-5 w-5" />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" /> : <Send aria-hidden className="h-5 w-5" />}
            {isSubmitting ? "Enviando…" : "Solicita una asesoría"}
          </Button>
        )}
      </div>
    </form>
  );
}
