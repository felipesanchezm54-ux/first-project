/**
 * Auditoría Lighthouse en móvil (configuración por defecto: Moto G Power, 4G lenta)
 * para Inicio, Servicios, Blog y Contacto. Guarda HTML + JSON en docs/lighthouse/.
 * Uso: npm run build && npm start (en otra terminal) → npm run lighthouse
 * CHROME_PATH permite indicar el ejecutable de Chrome/Chromium.
 */
import fs from "node:fs";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE = process.env.LH_BASE_URL ?? "http://localhost:3100";
const pages = [
  { name: "inicio", path: "/" },
  { name: "servicios", path: "/servicios" },
  { name: "blog", path: "/blog" },
  { name: "contacto", path: "/contacto" },
];

const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ["--headless=new", "--no-sandbox", "--no-proxy-server"],
});

const summary = [];
try {
  for (const p of pages) {
    const result = await lighthouse(`${BASE}${p.path}`, {
      port: chrome.port,
      output: ["html", "json"],
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: "mobile",
      logLevel: "error",
    });
    const [html, json] = result.report;
    fs.writeFileSync(`docs/lighthouse/${p.name}.html`, html);
    fs.writeFileSync(`docs/lighthouse/${p.name}.json`, json);
    const c = result.lhr.categories;
    const a = result.lhr.audits;
    summary.push({
      página: p.path,
      Performance: Math.round(c.performance.score * 100),
      Accesibilidad: Math.round(c.accessibility.score * 100),
      "Buenas prácticas": Math.round(c["best-practices"].score * 100),
      SEO: Math.round(c.seo.score * 100),
      LCP: a["largest-contentful-paint"].displayValue,
      CLS: a["cumulative-layout-shift"].displayValue,
      TBT: a["total-blocking-time"].displayValue,
    });
  }
} finally {
  await chrome.kill();
}

console.table(summary);
fs.writeFileSync("docs/lighthouse/resumen.json", JSON.stringify({ fecha: new Date().toISOString(), base: BASE, dispositivo: "móvil", resultados: summary }, null, 2));
