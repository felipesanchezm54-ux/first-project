import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { CookieSettingsButton } from "@/components/sections/cookie-settings-button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de cookies | NEXO",
  description:
    "Qué cookies usa el sitio de NEXO, para qué sirven y cómo aceptarlas, rechazarlas o cambiar tu decisión. GA4 y Meta Pixel solo cargan si aceptas. Revísala.",
  path: "/cookies",
});

const rows = [
  { name: "nexo_consent", type: "Necesaria", purpose: "Guarda tu decisión sobre cookies", duration: "6 meses" },
  { name: "nexo_session", type: "Necesaria", purpose: "Mantiene la sesión del panel de clientes", duration: "8 horas" },
  { name: "_ga, _ga_*", type: "Analítica (Google Analytics 4)", purpose: "Medir visitas y uso del sitio", duration: "Hasta 2 años" },
  { name: "_fbp", type: "Marketing (Meta Pixel)", purpose: "Medir anuncios y mostrar publicidad relevante", duration: "3 meses" },
];

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" path="/cookies" updatedAt="2026-09-20">
      <p>
        Las cookies son pequeños archivos que el sitio guarda en tu navegador. En NEXO usamos solo las necesarias para que el sitio funcione y, si
        nos das permiso, cookies de analítica y de marketing. Mientras no aceptes, Google Analytics 4 y Meta Pixel no se cargan.
      </p>

      <h2>Cookies que usamos</h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table>
          <caption className="sr-only">Cookies del sitio de NEXO</caption>
          <thead>
            <tr>
              <th scope="col">Cookie</th>
              <th scope="col">Tipo</th>
              <th scope="col">Finalidad</th>
              <th scope="col">Duración</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td>
                  <code>{r.name}</code>
                </td>
                <td>{r.type}</td>
                <td>{r.purpose}</td>
                <td>{r.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Cómo cambiar tu decisión</h2>
      <p>Puedes aceptar o rechazar cada tipo de cookie cuando quieras. También puedes borrarlas desde la configuración de tu navegador.</p>
      <CookieSettingsButton />

      <h2>Más información</h2>
      <p>
        El tratamiento de datos asociado a las cookies se rige por nuestra <Link href="/privacidad">política de privacidad</Link>, en cumplimiento de
        la Ley 1581 de 2012.
      </p>
    </LegalPage>
  );
}
