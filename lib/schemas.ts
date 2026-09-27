import { z } from "zod";
import { services } from "@/lib/content/services";
import { plans } from "@/lib/content/plans";

/**
 * Esquemas compartidos: el mismo archivo valida en el navegador (React Hook Form)
 * y en el servidor (Route Handlers). Ley de Postel: se acepta el dato en varios
 * formatos y se guarda siempre normalizado.
 */

/** Deja solo dígitos y, si es un número colombiano, lo devuelve en formato +57XXXXXXXXXX. */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 12 && digits.startsWith("57")) return `+${digits}`;
  if (digits.length === 10) return `+57${digits}`;
  return raw.trim().startsWith("+") ? `+${digits}` : digits;
}

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Escribe tu correo para poder responderte.")
  .pipe(z.email("Correo inválido: verifica que incluya @ y un dominio, por ejemplo nombre@empresa.com."));

const phoneField = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? normalizePhone(v) : ""))
  .refine((v) => v === "" || /^\+?\d{7,13}$/.test(v), {
    message: "Teléfono inválido: escribe 10 dígitos, con o sin +57 (ej. 300 123 4567).",
  });

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: "no-se", label: "Aún no lo sé, quiero asesoría" },
] as const;

const serviceValues = serviceOptions.map((o) => o.value) as [string, ...string[]];
const planValues = ["", ...plans.map((p) => p.id)] as [string, ...string[]];

/** Campo trampa (honeypot): los humanos no lo ven; si llega con texto es un bot. */
const honeypot = z.string().max(0).optional();

export const contactSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre (mínimo 2 letras).").max(80, "Máximo 80 caracteres."),
  empresa: z.string().trim().max(100, "Máximo 100 caracteres.").optional().default(""),
  correo: emailField,
  telefono: phoneField,
  servicio: z.enum(serviceValues, { message: "Elige el servicio que más te interesa." }),
  plan: z.enum(planValues).optional().default(""),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más: mínimo 10 caracteres.")
    .max(2000, "Máximo 2.000 caracteres."),
  habeasData: z.boolean().refine((v) => v === true, {
    message: "Necesitamos tu autorización para tratar tus datos y poder responderte.",
  }),
  comercial: z.boolean().optional().default(false),
  origen: z.string().trim().max(60).optional().default("contacto"),
  website: honeypot,
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export const quickLeadSchema = z.object({
  correo: emailField,
  servicio: z.enum(serviceValues, { message: "Elige un servicio." }),
  habeasData: z.boolean().refine((v) => v === true, { message: "Acepta el tratamiento de datos para continuar." }),
  website: honeypot,
});

export type QuickLeadInput = z.input<typeof quickLeadSchema>;

export const newsletterSchema = z.object({
  correo: emailField,
  consentimiento: z.boolean().refine((v) => v === true, {
    message: "Acepta recibir el boletín para suscribirte.",
  }),
  origen: z.string().trim().max(60).optional().default("footer"),
  website: honeypot,
});

export type NewsletterInput = z.input<typeof newsletterSchema>;

export const loginSchema = z.object({
  correo: emailField,
  password: z.string().min(1, "Escribe tu contraseña."),
});

export type LoginInput = z.input<typeof loginSchema>;

export const veraSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1000) }))
    .min(1)
    .max(12),
});

export const metricsQuerySchema = z.object({
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  channel: z.enum(["todos", "web", "instagram", "whatsapp", "email", "tienda"]).optional().default("todos"),
});

/** Convierte los errores de Zod a { campo: mensaje } para mostrarlos junto a cada campo. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
