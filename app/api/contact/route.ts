import { contactSchema, fieldErrors, quickLeadSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/mailer";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

const SUCCESS = "¡Mensaje enviado! Te contactamos en menos de 24 horas hábiles.";

/**
 * POST /api/contact
 * Valida con el mismo esquema Zod del formulario, guarda el Lead, envía el correo
 * (si hay RESEND_API_KEY) y responde 201. Acepta el formulario completo de /contacto
 * y el formulario rápido del inicio (`tipo: "rapido"`).
 */
export async function POST(req: Request) {
  const limit = rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limit.ok) return tooMany(limit.retryAfter);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ message: "No pudimos leer la solicitud." }, { status: 400 });

  // Honeypot: si el campo oculto trae texto es un bot. Respondemos "éxito" sin guardar nada.
  if (typeof body.website === "string" && body.website.length > 0) return Response.json({ message: SUCCESS }, { status: 201 });

  if (body.tipo === "rapido") {
    const parsed = quickLeadSchema.safeParse(body);
    if (!parsed.success) return Response.json({ message: "Revisa los campos marcados.", errors: fieldErrors(parsed.error) }, { status: 422 });
    const lead = await db.lead.create({
      data: {
        nombre: "Solicitud rápida (sin nombre)",
        correo: parsed.data.correo,
        servicio: parsed.data.servicio,
        mensaje: "Solicitud rápida desde el inicio: quiere una asesoría gratuita.",
        origen: "inicio",
        consentimientoHabeasData: true,
      },
    });
    const sent = await sendLeadEmail({ correo: parsed.data.correo, servicio: parsed.data.servicio, origen: "inicio" });
    if (sent) await db.lead.update({ where: { id: lead.id }, data: { correoEnviado: true } });
    return Response.json({ message: SUCCESS, id: lead.id }, { status: 201 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return Response.json({ message: "Revisa los campos marcados.", errors: fieldErrors(parsed.error) }, { status: 422 });
  const d = parsed.data;

  const lead = await db.lead.create({
    data: {
      nombre: d.nombre,
      empresa: d.empresa || null,
      correo: d.correo,
      telefono: d.telefono || null,
      servicio: d.servicio,
      plan: d.plan || null,
      mensaje: d.mensaje,
      origen: d.origen,
      consentimientoHabeasData: d.habeasData,
      aceptaComercial: d.comercial,
    },
  });

  const sent = await sendLeadEmail({ nombre: d.nombre, empresa: d.empresa, correo: d.correo, telefono: d.telefono, servicio: d.servicio, plan: d.plan, mensaje: d.mensaje, origen: d.origen });
  if (sent) await db.lead.update({ where: { id: lead.id }, data: { correoEnviado: true } });

  return Response.json({ message: SUCCESS, id: lead.id }, { status: 201 });
}
