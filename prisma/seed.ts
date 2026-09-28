/**
 * Seed de NEXO: crea a Tienda Óptica, el usuario demo del panel, métricas diarias
 * simuladas por canal, campañas, artículos del blog y el caso de éxito.
 *
 * TODOS LOS NÚMEROS SON SIMULADOS CON FINES ACADÉMICOS. Se generan con una
 * semilla fija para que el panel muestre siempre los mismos datos en la exposición
 * y queden calibrados con las cifras del caso (+17,8 % al mes 5, CPL de ~$14.200
 * a ~$9.600, apertura de email ~46 %).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { tiendaOptica } from "../lib/content/cases";

const db = new PrismaClient();

// ── Generador pseudoaleatorio con semilla (mulberry32) ─────────────────────
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(2026);
const noise = (amp: number) => 1 + (rand() * 2 - 1) * amp;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Poisson aproximado para conteos pequeños (evita decimales en leads y conversiones).
function count(mean: number) {
  const base = Math.floor(mean);
  return base + (rand() < mean - base ? 1 : 0);
}

// ── Calendario ─────────────────────────────────────────────────────────────
const PROJECT_START = new Date("2026-05-04T00:00:00-05:00"); // Lunes
const BASELINE_DAYS = 56; // 8 semanas antes de NEXO (línea base)
const PROJECT_DAYS = 147; // 21 semanas ≈ 5 meses
const DAY = 86_400_000;

const BASELINE_DIGITAL_CONV_PER_DAY = 6; // conversiones digitales/día antes de NEXO
const GOAL = 0.2;

type Row = { canal: string; nombre: string; valor: number; meta?: number; fecha: Date };

function generateMetrics(): Row[] {
  const rows: Row[] = [];
  for (let d = -BASELINE_DAYS; d < PROJECT_DAYS; d++) {
    const fecha = new Date(PROJECT_START.getTime() + d * DAY);
    const dow = fecha.getUTCDay(); // 0 domingo … 6 sábado (fecha a las 05:00 UTC)
    const weekend = dow === 0 || dow === 6;
    const p = Math.max(0, Math.min(1, d / PROJECT_DAYS)); // avance del proyecto 0 → 1
    const active = d >= 0;
    const push = (canal: string, nombre: string, valor: number, meta?: number) => rows.push({ canal, nombre, valor, meta, fecha });

    // Estacionalidad simple: fines de semana más tienda y redes, menos web y email.
    const wWeb = weekend ? 0.75 : 1.05;
    const wShop = dow === 6 ? 1.5 : dow === 0 ? 1.2 : 0.9;
    const wSocial = weekend ? 1.15 : 0.95;

    // Leads totales: ~3/día antes de NEXO; de 5 a 10/día durante el proyecto.
    const leadsTotal = active ? lerp(5.2, 10.45, p) : 3;
    const split = { web: 0.3, instagram: 0.25, whatsapp: 0.2, email: 0.1, tienda: 0.15 };

    // Conversiones digitales: línea base 6/día, suben ~+20 % a lo largo de 21 semanas.
    const uplift = active ? lerp(0.005, 0.183, p) : 0;
    const digitalConv = BASELINE_DIGITAL_CONV_PER_DAY * (1 + uplift);
    const convSplit = { web: 0.3, instagram: 0.2, whatsapp: 0.4, email: 0.1 };
    const goalPerDay = BASELINE_DIGITAL_CONV_PER_DAY * (1 + GOAL * p);

    // Inversión diaria (COP): de ~75.500 a ~97.000.
    const invTotal = active ? lerp(75_500, 97_000, p) : 45_000;
    const invSplit = { instagram: 0.6, web: 0.25, email: 0.05, tienda: 0.1, whatsapp: 0 };

    // Web
    push("web", "alcance", Math.round(lerp(150, 400, p) * wWeb * noise(0.12)));
    push("web", "interacciones", Math.round(lerp(active ? 10 : 4, 30, p) * wWeb * noise(0.2)));
    push("web", "leads", count(leadsTotal * split.web * wWeb * noise(0.25)));
    push("web", "conversiones", count(digitalConv * convSplit.web * wWeb * noise(0.2)), +(goalPerDay * convSplit.web).toFixed(2));
    push("web", "inversion", Math.round(invTotal * invSplit.web * noise(0.08)));

    // Instagram (incluye Facebook y TikTok en el reporte de redes)
    push("instagram", "alcance", Math.round(lerp(1500, 4000, p) * wSocial * noise(0.18)));
    push("instagram", "interacciones", Math.round(lerp(90, 250, p) * wSocial * noise(0.2)));
    push("instagram", "leads", count(leadsTotal * split.instagram * wSocial * noise(0.25)));
    push("instagram", "conversiones", count(digitalConv * convSplit.instagram * wSocial * noise(0.2)), +(goalPerDay * convSplit.instagram).toFixed(2));
    push("instagram", "seguidores_nuevos", Math.round(lerp(active ? 8 : 4, 25, p) * wSocial * noise(0.3)));
    push("instagram", "inversion", Math.round(invTotal * invSplit.instagram * noise(0.08)));

    // WhatsApp
    push("whatsapp", "clics_whatsapp", Math.round(lerp(active ? 15 : 8, 30, p) * noise(0.2)));
    push("whatsapp", "interacciones", Math.round(lerp(10, 25, p) * noise(0.2)));
    push("whatsapp", "leads", count(leadsTotal * split.whatsapp * noise(0.25)));
    push("whatsapp", "conversiones", count(digitalConv * convSplit.whatsapp * noise(0.2)), +(goalPerDay * convSplit.whatsapp).toFixed(2));

    // Email (Mailchimp) — sin envíos antes de NEXO
    if (active) {
      const sent = Math.round(lerp(120, 400, p) * (weekend ? 0.3 : 1.15) * noise(0.1));
      const openRate = lerp(0.44, 0.48, p) * noise(0.04);
      push("email", "enviados", sent);
      push("email", "aperturas", Math.round(sent * openRate));
      push("email", "interacciones", Math.round(sent * openRate * lerp(0.18, 0.24, p)));
      push("email", "leads", count(leadsTotal * split.email * noise(0.25)));
      push("email", "conversiones", count(digitalConv * convSplit.email * noise(0.2)), +(goalPerDay * convSplit.email).toFixed(2));
      push("email", "recompras", count(lerp(0.4, 1.6, p) * noise(0.3)));
      push("email", "inversion", Math.round(invTotal * invSplit.email));
    } else {
      // Antes de NEXO no había email marketing: esa parte de las conversiones llegaba por WhatsApp.
      push("whatsapp", "conversiones", count(digitalConv * convSplit.email * noise(0.2)), +(goalPerDay * convSplit.email).toFixed(2));
    }

    // Tienda física (QR del Club)
    push("tienda", "alcance", Math.round(lerp(60, 90, p) * wShop * noise(0.15)));
    push("tienda", "interacciones", Math.round(lerp(active ? 3 : 0, 8, p) * wShop * noise(0.3)));
    push("tienda", "leads", count(leadsTotal * split.tienda * wShop * noise(0.25)));
    push("tienda", "recompras", count(lerp(active ? 0.8 : 0.6, 1.8, p) * wShop * noise(0.3)));
    push("tienda", "inversion", Math.round(invTotal * invSplit.tienda * noise(0.08)));

    // Bandas de lead scoring de los leads nuevos del día (sin canal específico → "todos").
    const dist = [lerp(0.35, 0.22, p), lerp(0.28, 0.24, p), lerp(0.2, 0.24, p), lerp(0.12, 0.18, p), lerp(0.05, 0.12, p)];
    const names = ["banda_frio", "banda_tibio", "banda_interesado", "banda_caliente", "banda_fidelizado"];
    names.forEach((n, i) => push("todos", n, +(leadsTotal * dist[i] * noise(0.2)).toFixed(2)));
  }
  return rows;
}

async function main() {
  // En Netlify el seed corre en cada despliegue con SEED_IF_EMPTY=1: si ya hay datos, no toca nada.
  if (process.env.SEED_IF_EMPTY === "1" && (await db.client.count()) > 0) {
    console.log("✓ La base ya tiene datos: se omite el seed.");
    return;
  }
  console.log("→ Limpiando datos anteriores…");
  await db.metric.deleteMany();
  await db.campaign.deleteMany();
  await db.user.deleteMany();
  await db.client.deleteMany();
  await db.post.deleteMany();
  await db.caseStudy.deleteMany();

  console.log("→ Creando cliente Tienda Óptica y usuario demo…");
  const client = await db.client.create({
    data: {
      slug: "tienda-optica",
      nombre: "Tienda Óptica",
      sector: "Salud visual y retail",
      logo: null,
      lineaBaseConversionesSemana: BASELINE_DIGITAL_CONV_PER_DAY * 7,
      metaAumento: GOAL,
      inicioProyecto: PROJECT_START,
    },
  });
  await db.user.create({
    data: {
      correo: "demo@tiendaoptica.co",
      nombre: "Equipo Tienda Óptica",
      passwordHash: await bcrypt.hash("nexo2026", 10),
      clientId: client.id,
    },
  });

  console.log("→ Generando métricas diarias simuladas…");
  const rows = generateMetrics();
  const chunk = 1000;
  for (let i = 0; i < rows.length; i += chunk) {
    await db.metric.createMany({ data: rows.slice(i, i + chunk).map((r) => ({ ...r, clientId: client.id })) });
  }
  console.log(`  ${rows.length} registros`);

  console.log("→ Creando campañas…");
  const campaigns = [
    { nombre: "Flujo de bienvenida", canal: "email", estado: "activa", inversion: 180_000, inicio: "2026-05-11", resultados: { enviados: 1_126, aperturaPct: 58.2, clicsPct: 14.1, conversiones: 64 } },
    { nombre: "Posventa (3 días)", canal: "email", estado: "activa", inversion: 120_000, inicio: "2026-05-18", resultados: { enviados: 742, aperturaPct: 51.6, clicsPct: 9.8, conversiones: 38 } },
    { nombre: "Carrito abandonado (24 h)", canal: "email", estado: "activa", inversion: 90_000, inicio: "2026-06-01", resultados: { enviados: 318, aperturaPct: 47.3, clicsPct: 18.6, conversiones: 41 } },
    { nombre: "Renovación de fórmula (12 meses)", canal: "email", estado: "activa", inversion: 60_000, inicio: "2026-06-15", resultados: { enviados: 486, aperturaPct: 44.9, clicsPct: 12.4, conversiones: 52 } },
    { nombre: "Mantenimiento (6 meses)", canal: "email", estado: "programada", inversion: 0, inicio: "2026-11-02", resultados: { enviados: 0, aperturaPct: 0, clicsPct: 0, conversiones: 0 } },
    { nombre: "Remarketing quiz de estilo visual", canal: "instagram", estado: "activa", inversion: 2_450_000, inicio: "2026-06-08", resultados: { alcance: 48_200, clics: 1_930, leads: 214, conversiones: 71 } },
    { nombre: "Búsqueda local «examen visual»", canal: "web", estado: "activa", inversion: 1_380_000, inicio: "2026-06-22", resultados: { clics: 2_310, leads: 132, conversiones: 58 } },
    { nombre: "Parrilla de diciembre", canal: "instagram", estado: "en preparación", inversion: 0, inicio: "2026-12-01", resultados: { piezas: 24 } },
  ];
  for (const c of campaigns) {
    await db.campaign.create({
      data: { clientId: client.id, nombre: c.nombre, canal: c.canal, estado: c.estado, inversion: c.inversion, inicio: new Date(c.inicio), resultados: JSON.stringify(c.resultados) },
    });
  }

  console.log("→ Copiando artículos del blog (MDX → tabla Post)…");
  const dir = path.join(process.cwd(), "content", "blog");
  const authors: Record<string, string> = { felipe: "Felipe", martin: "Martín", sofia: "Sofía", "maria-isabel": "María Isabel" };
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    await db.post.create({
      data: {
        slug: file.replace(/\.mdx$/, ""),
        titulo: data.title,
        resumen: data.excerpt ?? data.description,
        contenido: content,
        categoria: data.category,
        autor: authors[data.author] ?? data.author,
        fecha: new Date(data.publishedAt),
        fechaActualizacion: new Date(data.updatedAt ?? data.publishedAt),
      },
    });
  }

  console.log("→ Creando caso de éxito…");
  await db.caseStudy.create({
    data: {
      slug: tiendaOptica.slug,
      marca: tiendaOptica.brand,
      problema: tiendaOptica.problem,
      estrategia: tiendaOptica.strategy,
      resultado: tiendaOptica.result,
      metricasDestacadas: JSON.stringify(tiendaOptica.metrics),
    },
  });

  console.log("✓ Seed completo. Usuario demo: demo@tiendaoptica.co / nexo2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
