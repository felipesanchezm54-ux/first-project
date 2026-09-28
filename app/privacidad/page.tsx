import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de privacidad y tratamiento de datos | NEXO",
  description:
    "Política de tratamiento de datos personales de NEXO según la Ley 1581 de 2012: qué datos recolectamos, para qué, tus derechos y cómo ejercerlos. Léela.",
  path: "/privacidad",
});

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad y tratamiento de datos" path="/privacidad" updatedAt="2026-09-20">
      <p>
        Esta política explica cómo {site.legalName} (en adelante, NEXO) recolecta, usa, almacena y protege los datos personales, en cumplimiento de
        la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas colombianas de protección de datos.
      </p>
      <p>
        <em>Documento base de la propuesta académica. Antes de publicar el sitio en producción debe revisarlo un abogado.</em>
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        {site.legalName}, con domicilio en {site.address.street}, {site.address.city}, {site.address.region}, Colombia. Correo:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Teléfono: {site.phoneDisplay}.
      </p>

      <h2>2. Datos que recolectamos</h2>
      <ul>
        <li>
          <strong>Formulario de contacto:</strong> nombre, empresa, correo, teléfono, servicio de interés y mensaje.
        </li>
        <li>
          <strong>Boletín:</strong> correo electrónico.
        </li>
        <li>
          <strong>Panel de clientes:</strong> correo y contraseña cifrada de los usuarios autorizados por cada cliente.
        </li>
        <li>
          <strong>Navegación:</strong> datos técnicos y, solo si los aceptas, cookies de analítica y de marketing (ver{" "}
          <Link href="/cookies">política de cookies</Link>).
        </li>
      </ul>
      <p>No recolectamos datos sensibles a través de este sitio ni datos de niños, niñas o adolescentes.</p>

      <h2>3. Finalidades</h2>
      <ol>
        <li>Responder solicitudes de información y agendar asesorías.</li>
        <li>Prestar los servicios contratados y dar acceso al panel de resultados.</li>
        <li>Enviar el boletín y comunicaciones comerciales, solo si lo autorizaste de forma separada.</li>
        <li>Medir el uso del sitio para mejorarlo, solo si aceptaste las cookies de analítica.</li>
        <li>Cumplir obligaciones legales, contables y tributarias.</li>
      </ol>

      <h2>4. Autorización</h2>
      <p>
        Pedimos tu autorización previa, expresa e informada mediante casillas que no vienen marcadas. La autorización para responder tu solicitud y la
        autorización para comunicaciones comerciales son independientes. Guardamos la fecha y el canal en que la otorgaste como prueba.
      </p>

      <h2>5. Tus derechos como titular</h2>
      <ul>
        <li>Conocer, actualizar y rectificar tus datos.</li>
        <li>Solicitar prueba de la autorización otorgada.</li>
        <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
        <li>Revocar la autorización y pedir la supresión de tus datos cuando no exista un deber legal de conservarlos.</li>
        <li>Acceder gratuitamente a tus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
      </ul>

      <h2>6. Cómo ejercer tus derechos</h2>
      <p>
        Escribe a <a href={`mailto:${site.email}`}>{site.email}</a> con el asunto «Habeas Data», tu nombre, tu solicitud y un medio de respuesta.
        Atendemos consultas en máximo 10 días hábiles y reclamos en máximo 15 días hábiles, según los plazos de la Ley 1581 de 2012.
      </p>

      <h2>7. Seguridad y conservación</h2>
      <p>
        Aplicamos medidas técnicas y administrativas razonables: conexión cifrada (HTTPS), contraseñas almacenadas con hash, acceso restringido al
        personal necesario y copias de seguridad. Conservamos los datos mientras dure la finalidad y el tiempo exigido por la ley.
      </p>

      <h2>8. Encargados y transferencias</h2>
      <p>
        Para operar usamos proveedores que actúan como encargados (hosting, envío de correo, analítica). Algunos pueden estar fuera de Colombia; en
        esos casos exigimos niveles adecuados de protección conforme a la normativa colombiana.
      </p>

      <h2>9. Vigencia</h2>
      <p>Esta política rige desde su publicación. Cualquier cambio sustancial se informará en este sitio.</p>
    </LegalPage>
  );
}
