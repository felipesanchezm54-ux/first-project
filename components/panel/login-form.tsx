"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LogIn } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { Field, describedBy, inputClasses } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { correo: "", password: "" }, mode: "onTouched" });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.message ?? "No pudimos iniciar sesión. Intenta de nuevo.");
      return;
    }
    const next = params.get("next");
    router.push(next && next.startsWith("/panel") ? next : "/panel");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field id="login-correo" label="Correo" error={errors.correo?.message}>
        <input id="login-correo" type="email" inputMode="email" autoComplete="username" aria-invalid={errors.correo ? true : undefined} aria-describedby={describedBy("login-correo", errors.correo?.message)} className={inputClasses} {...register("correo")} />
      </Field>
      <Field id="login-password" label="Contraseña" error={errors.password?.message}>
        <input id="login-password" type="password" autoComplete="current-password" aria-invalid={errors.password ? true : undefined} aria-describedby={describedBy("login-password", errors.password?.message)} className={inputClasses} {...register("password")} />
      </Field>
      <div aria-live="assertive">{error ? <p className="rounded-xl border border-danger/40 p-3 text-sm font-medium text-danger">{error}</p> : null}</div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" /> : <LogIn aria-hidden className="h-5 w-5" />}
        {isSubmitting ? "Ingresando…" : "Ingresar al panel"}
      </Button>
      {/* Ley de Tesler: el sistema completa el usuario demo con un clic. */}
      <button
        type="button"
        onClick={() => {
          setValue("correo", "demo@tiendaoptica.co", { shouldValidate: true });
          setValue("password", "nexo2026", { shouldValidate: true });
        }}
        className="w-full rounded-xl border border-dashed border-border p-4 text-left text-sm hover:border-accent"
      >
        <span className="font-semibold">Usar la cuenta demo de Tienda Óptica</span>
        <span className="mt-1 block text-muted">demo@tiendaoptica.co · nexo2026 (datos de demostración)</span>
      </button>
    </form>
  );
}
