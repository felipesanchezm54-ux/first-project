import { test } from "@playwright/test";
import { consentCookie, publicRoutes } from "./routes";

/**
 * Capturas de cada página en móvil (375), tablet (768) y escritorio (1440) → docs/capturas/.
 * Se ejecuta aparte: npm run capturas (solo con el proyecto "escritorio"; el ancho lo fija cada prueba).
 */
const widths = [375, 768, 1440];
const name = (route: string) => (route === "/" ? "inicio" : route.slice(1).replace(/\//g, "_"));

test.describe.configure({ mode: "serial" });
test.skip(({ isMobile }) => isMobile, "Las capturas fijan su propio ancho");
test.skip(() => !process.env.CAPTURAS, "Solo con npm run capturas");

async function scrollThrough(page: import("@playwright/test").Page) {
  // Recorre la página para disparar las animaciones de aparición y los contadores.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1800);
}

for (const width of widths) {
  test(`capturas ${width}px`, async ({ browser }) => {
    test.setTimeout(300_000);
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    await context.addCookies([consentCookie]);
    const page = await context.newPage();
    for (const route of [...publicRoutes, "/pagina-que-no-existe"]) {
      await page.goto(route);
      await scrollThrough(page);
      await page.screenshot({ path: `docs/capturas/${width}/${route.startsWith("/pagina") ? "404" : name(route)}.jpg`, fullPage: true, type: "jpeg", quality: 60 });
    }
    // Panel de clientes con la cuenta demo
    await page.goto("/panel/ingresar");
    await page.screenshot({ path: `docs/capturas/${width}/panel_ingresar.jpg`, fullPage: true, type: "jpeg", quality: 60 });
    await page.getByRole("button", { name: /Usar la cuenta demo/ }).click();
    await page.getByRole("button", { name: "Ingresar al panel" }).click();
    await page.waitForURL("**/panel");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `docs/capturas/${width}/panel.jpg`, fullPage: true, type: "jpeg", quality: 60 });
    // Vera abierta sobre el inicio
    await page.goto("/");
    await page.getByRole("button", { name: /Abrir chat con Vera/ }).click();
    await page.getByRole("button", { name: "¿Cuánto cuestan los planes?" }).click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `docs/capturas/${width}/vera.jpg`, type: "jpeg", quality: 75 });
    await context.close();
  });
}
