import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Términos y condiciones de uso | NEXO",
  description:
    "Términos y condiciones de uso del sitio web de NEXO, agencia de marketing digital en Medellín: contenido, propiedad intelectual y responsabilidad. Léelos.",
  path: "/terminos",
});

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y condiciones de uso" path="/terminos" updatedAt="2026-09-20">
      <p>
        Al usar este sitio aceptas estos términos. Si no estás de acuerdo, te pedimos no usarlo. <em>Documento base de la propuesta académica; debe
        revisarlo un abogado antes de publicarse en producción.</em>
      </p>

      <h2>1. Sobre el sitio</h2>
      <p>
        Este sitio pertenece a {site.legalName}, con domicilio en {site.address.city}, Colombia. Su finalidad es informar sobre nuestros servicios de
        marketing digital y permitir que nos contactes.
      </p>

      <h2>2. Contenido y cifras</h2>
      <p>
        Los precios publicados en <Link href="/planes">Planes</Link> son de referencia y no constituyen una oferta vinculante: el valor final se define
        en una propuesta escrita. Las cifras marcadas como «ilustrativas» o «datos de demostración» son simulaciones con fines académicos y no
        garantizan resultados.
      </p>

      <h2>3. Propiedad intelectual</h2>
      <p>
        Los textos, el diseño, el logo de NEXO y el código del sitio son propiedad de NEXO o se usan con autorización. Puedes citar fragmentos del
        blog con enlace a la fuente. No está permitido reproducir el sitio completo ni usar la marca sin autorización.
      </p>

      <h2>4. Panel de clientes</h2>
      <p>
        El acceso al panel es personal. Eres responsable de guardar tu contraseña. El usuario de demostración publicado en el sitio solo da acceso a
        datos simulados.
      </p>

      <h2>5. Vera, agente de IA</h2>
      <p>
        Vera ofrece respuestas automáticas de orientación general. No reemplaza la asesoría del equipo ni constituye una propuesta comercial. Las
        decisiones sobre tu marca siempre las tomas tú con el equipo de NEXO.
      </p>

      <h2>6. Responsabilidad</h2>
      <p>
        Hacemos lo posible para que la información sea correcta y el sitio esté disponible, pero no garantizamos que esté libre de errores o
        interrupciones. Los enlaces a sitios de terceros se ofrecen como referencia.
      </p>

      <h2>7. Datos personales</h2>
      <p>
        El tratamiento de tus datos se rige por la <Link href="/privacidad">política de privacidad</Link> y la{" "}
        <Link href="/cookies">política de cookies</Link>.
      </p>

      <h2>8. Ley aplicable</h2>
      <p>Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se resolverá ante los jueces de Medellín.</p>
    </LegalPage>
  );
}
