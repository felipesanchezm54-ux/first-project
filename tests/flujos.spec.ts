import { expect, test } from "@playwright/test";
import { consentCookie } from "./routes";

test.describe("Flujos principales", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([consentCookie]);
  });

  test("CTA del hero llevan a contacto y al caso", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Potencia tu marca" }).first().click();
    await expect(page).toHaveURL(/\/contacto$/);
    await page.goto("/");
    await page.getByRole("link", { name: "Ver resultados reales" }).click();
    await expect(page).toHaveURL(/\/portafolio\/tienda-optica$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Estrategia de marketing para ópticas");
  });

  test("navegación principal (menú o hamburguesa)", async ({ page, isMobile }) => {
    await page.goto("/");
    for (const [label, path] of [
      ["Nosotros", "/nosotros"],
      ["Planes", "/planes"],
      ["Blog", "/blog"],
      ["Portafolio", "/portafolio"],
      ["Contacto", "/contacto"],
    ]) {
      if (isMobile) {
        await page.getByRole("button", { name: "Abrir menú" }).click();
        await page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link", { name: label }).click();
      } else {
        await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: label, exact: true }).click();
      }
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
  });

  test("menú desplegable de servicios lleva al ancla", async ({ page, isMobile }) => {
    test.skip(isMobile, "El desplegable es de escritorio");
    await page.goto("/");
    await page.getByRole("button", { name: "Servicios" }).click();
    await page.getByRole("link", { name: /Publicidad digital/ }).first().click();
    await expect(page).toHaveURL(/\/servicios#publicidad-digital$/);
  });

  test("tarjeta de servicio del inicio lleva a su ancla", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Qué incluye redes sociales/ }).click();
    await expect(page).toHaveURL(/\/servicios#redes-sociales$/);
  });

  test("planes: toggle trimestral y plan preseleccionado en contacto", async ({ page }) => {
    await page.goto("/planes");
    await page.getByRole("radio", { name: /trimestral/i }).click();
    await expect(page.getByText(/Facturado cada 3 meses/).first()).toBeVisible();
    await page.getByRole("link", { name: "Agenda una asesoría gratuita para el plan Full Brand" }).click();
    await expect(page).toHaveURL(/\/contacto\?plan=full-brand$/);
    await page.locator("main").getByLabel("Nombre").fill("Prueba Automática");
    await page.locator("main").getByLabel("Correo electrónico").fill("prueba@empresa.co");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator("main").getByLabel("Plan")).toHaveValue("full-brand");
  });

  test("formulario de contacto: errores claros, 2 pasos y envío", async ({ page }) => {
    await page.goto("/contacto");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Escribe tu nombre (mínimo 2 letras).")).toBeVisible();
    await page.locator("main").getByLabel("Nombre").fill("Laura Gómez");
    await page.locator("main").getByLabel("Correo electrónico").fill("correo-sin-arroba");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText(/verifica que incluya @/)).toBeVisible();
    await page.locator("main").getByLabel("Correo electrónico").fill("LAURA@CafeAndino.co");
    await page.locator("main").getByLabel(/Teléfono o WhatsApp/).fill("+57 300 123 4567");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Paso 2 de 2 · Tu proyecto")).toBeVisible();
    await page.locator("main").getByLabel("Servicio de interés").selectOption("redes-sociales");
    await page.locator("main").getByLabel("¿Qué quieres lograr?").fill("Queremos más citas desde Instagram en 3 meses.");
    await page.getByRole("button", { name: "Solicita una asesoría" }).first().click();
    await expect(page.getByText("Necesitamos tu autorización para tratar tus datos y poder responderte.")).toBeVisible();
    await page.getByRole("checkbox", { name: /Autorizo el tratamiento de mis datos/ }).check();
    await page.getByRole("button", { name: "Solicita una asesoría" }).first().click();
    await expect(page.getByRole("status")).toContainText("¡Mensaje enviado! Te contactamos en menos de 24 horas hábiles.");
  });

  test("WhatsApp con mensaje prellenado", async ({ page }) => {
    await page.goto("/contacto");
    const href = await page.getByRole("link", { name: "Escribir por WhatsApp" }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });

  test("FAQ en acordeón accesible", async ({ page }) => {
    await page.goto("/contacto");
    const q = page.getByRole("button", { name: "¿Tengo que firmar un contrato largo?" });
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("No. Los planes son mensuales")).toBeVisible();
  });

  test("filtro del blog y artículo con TOC", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("button", { name: /Publicidad digital/ }).click();
    const visibles = page.getByRole("list").filter({ has: page.getByRole("heading", { name: /Meta Ads/ }) }).getByRole("listitem").filter({ visible: true });
    await expect(visibles).toHaveCount(1);
    await page.getByRole("link", { name: /¿Cuánto invertir en Meta Ads/ }).first().click();
    await expect(page.getByRole("navigation", { name: "Tabla de contenido" })).toBeVisible();
    await expect(page.getByText(/Actualizado el/).first()).toBeVisible();
  });

  test("newsletter del footer", async ({ page }) => {
    await page.goto("/nosotros");
    // El formulario se carga en diferido cuando el footer se acerca a la pantalla.
    await page.locator("footer").scrollIntoViewIfNeeded();
    const form = page.locator("footer form");
    await form.getByLabel("Correo electrónico").fill(`boletin-${Date.now()}@empresa.co`);
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Suscribirme" }).click();
    await expect(form.getByText("¡Listo! Te llegará el próximo boletín.")).toBeVisible();
  });

  test("Vera responde a una pregunta sugerida", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Abrir chat con Vera/ }).click();
    await page.getByRole("button", { name: "¿Qué servicios ofrecen?" }).click();
    await expect(page.getByRole("dialog").getByText(/Hacemos seis cosas|servicio/i).last()).toBeVisible();
  });
});

test.describe("Cookies", () => {
  test("banner: rechazar oculta el banner y no carga analítica", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Aviso de cookies" });
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Rechazar" }).click();
    await expect(banner).toBeHidden();
    expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
    await page.reload();
    await expect(page.getByRole("region", { name: "Aviso de cookies" })).toBeHidden();
  });

  test("banner: configurar abre las preferencias", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Configurar" }).click();
    await expect(page.getByRole("dialog", { name: "Preferencias de cookies" })).toBeVisible();
    await page.getByRole("button", { name: "Guardar preferencias" }).click();
    await expect(page.getByRole("region", { name: "Aviso de cookies" })).toBeHidden();
  });
});

test.describe("Panel de clientes", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([consentCookie]);
  });

  test("login, filtros, exportación CSV y cierre de sesión", async ({ page }) => {
    await page.goto("/panel");
    await expect(page).toHaveURL(/\/panel\/ingresar$/);
    await page.locator("main").getByLabel("Correo", { exact: true }).fill("demo@tiendaoptica.co");
    await page.locator("main").getByLabel("Contraseña").fill("incorrecta");
    await page.getByRole("button", { name: "Ingresar al panel" }).click();
    await expect(page.getByText("El correo o la contraseña no coinciden.")).toBeVisible();
    await page.getByRole("button", { name: /Usar la cuenta demo/ }).click();
    await page.getByRole("button", { name: "Ingresar al panel" }).click();
    await expect(page).toHaveURL(/\/panel$/);
    await expect(page.getByText("Datos de demostración").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Insight de Vera" })).toBeVisible();

    const leads = page.locator("li", { hasText: "Leads del período" }).locator("p").nth(1);
    const before = await leads.innerText();
    await page.getByRole("combobox", { name: "Canal", exact: true }).selectOption("web");
    await expect(page.getByText(/· Sitio web$/)).toBeVisible();
    await expect(leads).not.toHaveText(before);

    await page.getByRole("combobox", { name: "Período" }).selectOption("todo");
    await expect(page.getByText(/Mostrando del 9 de mar/)).toBeVisible();

    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "Exportar CSV" }).click()]);
    expect(download.suggestedFilename()).toMatch(/^nexo-tienda-optica_2026-03-09_2026-09-27_web\.csv$/);

    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(page).toHaveURL(/\/panel\/ingresar$/);
  });
});
