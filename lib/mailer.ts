/**
 * Envío de correo con la API de Resend. Si no hay RESEND_API_KEY, no se envía
 * nada y se devuelve `false`: el lead ya quedó guardado y la demo no se rompe.
 */
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendLeadEmail(lead: Record<string, string | boolean | undefined>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const rows = Object.entries(lead)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${escape(k)}</b></td><td>${escape(String(v))}</td></tr>`)
    .join("");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "NEXO <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? "hola@nexo.example"],
        reply_to: typeof lead.correo === "string" ? lead.correo : undefined,
        subject: `Nuevo lead: ${lead.nombre ?? lead.correo} (${lead.servicio})`,
        html: `<h2>Nuevo lead desde el sitio de NEXO</h2><table>${rows}</table>`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
