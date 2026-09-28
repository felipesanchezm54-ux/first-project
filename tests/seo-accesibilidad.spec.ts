import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { consentCookie, publicRoutes } from "./routes";

test.beforeEach(async ({ context }) => {
  await context.addCookies([consentCookie]);
});

for (const route of publicRoutes) {
  test(`SEO y accesibilidad: ${route}`, async ({ page }, info) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);

    // Title ≤ 60 caracteres con la marca
    const title = await page.title();
    expect(title.length, `title "${title}"`).toBeLessThanOrEqual(60);
    expect(title).toContain("NEXO");

    // Meta descripción de 120–155 caracteres (tabla de la profesora)
    const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(description.length, `description "${description}"`).toBeGreaterThanOrEqual(120);
    expect(description.length, `description "${description}"`).toBeLessThanOrEqual(155);

    // Canonical absoluto y Open Graph
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\//);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);

    // Un solo H1 y jerarquía sin saltos (no pasar de H2 a H4, etc.)
    await expect(page.locator("h1")).toHaveCount(1);
    const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `salto de H${levels[i - 1]} a H${levels[i]}`).toBeLessThanOrEqual(1);

    // Imágenes con alt, sin textos de relleno ni el nombre anterior de la marca
    expect(await page.locator("img:not([alt])").count()).toBe(0);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/lorem ipsum/i);
    expect(text).not.toMatch(/creative nova/i);

    // Enlaces internos rastreables: al menos 2 en el contenido principal
    const internal = await page.locator('main a[href^="/"]').count();
    expect(internal).toBeGreaterThanOrEqual(2);

    // JSON-LD válido
    for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(raw)).not.toThrow();

    // Accesibilidad (WCAG 2.2 AA) con axe: sin violaciones serias o críticas
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`), `proyecto ${info.project.name}`).toEqual([]);
  });
}

test("sitemap, robots y llms.txt", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const r of publicRoutes) expect(sitemap).toContain(`<loc>https://nexo.example${r}</loc>`);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /panel");
  expect(robots).toContain("Sitemap:");
  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain("# NEXO");
});

test("404 personalizada", async ({ page }) => {
  const res = await page.goto("/esta-pagina-no-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Este enlace no llevó a ningún lado");
  await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible();
});
