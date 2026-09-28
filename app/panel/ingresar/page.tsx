import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/panel/login-form";
import { getSession } from "@/lib/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ingresar al panel de clientes | NEXO",
  description: "Acceso al panel de resultados de NEXO para clientes: KPIs, embudo, lead scoring y campañas en tiempo real. Ingresa con tu correo y contraseña.",
  path: "/panel/ingresar",
  noindex: true,
});

export default async function LoginPage() {
  if (await getSession()) redirect("/panel");
  return (
    <section className="grain min-h-[80vh] pb-20 pt-[calc(var(--header-h)+3rem)]">
      <div className="container-nexo grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Panel de clientes</p>
          <h1 className="mt-4 text-h1 font-bold">Ingresa y mira tus resultados</h1>
          <p className="mt-5 max-w-lg text-lead text-muted">
            Conversiones contra la meta, leads por canal, lead scoring, campañas activas y la lectura de Vera. Todo actualizado y exportable a CSV.
          </p>
        </div>
        <div data-tone="light" className="card p-7 md:p-10">
          <div className="flex items-center gap-3">
            <LockKeyhole aria-hidden className="h-6 w-6 text-accent" />
            <h2 className="text-h3 font-semibold">Iniciar sesión</h2>
          </div>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
