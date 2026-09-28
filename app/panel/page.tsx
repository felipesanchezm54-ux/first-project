import { redirect } from "next/navigation";
import { Dashboard } from "@/components/panel/dashboard";
import { getDashboard } from "@/lib/dashboard";
import { getSession } from "@/lib/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Panel de resultados | NEXO",
  description: "Panel de resultados de NEXO: KPIs, embudo, lead scoring, rendimiento por canal y campañas de tu marca, con filtros por fecha y canal y exportación CSV.",
  path: "/panel",
  noindex: true,
});

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const session = await getSession();
  if (!session) redirect("/panel/ingresar");
  // Render inicial en el servidor: los datos llegan con el HTML (sin pantalla de carga).
  const data = await getDashboard(session.clientId, {});
  if (!data) redirect("/api/auth/logout?next=/panel/ingresar");
  return (
    <div data-tone="light">
      <Dashboard initial={data} userName={session.nombre} />
    </div>
  );
}
