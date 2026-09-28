# NEXO · Sitio web de la agencia de marketing digital

**Sitio en vivo:** https://nexo-agencia-ceipa.netlify.app

Propuesta académica para el taller de SEO y UX de **CEIPA Business School**: sitio web de **NEXO**, agencia de marketing digital de Medellín enfocada en resultados medibles. Incluye el sitio público, un blog, el caso de éxito de **Tienda Óptica**, un **panel de clientes** con datos de demostración y **Vera**, la agente de IA de la agencia.

> Todos los números del panel y del caso de éxito son **datos simulados con fines académicos** y están marcados como ilustrativos en el sitio.

---

## Cómo instalar y correr el proyecto

Requisitos: **Node.js 20 o superior** y npm.

```bash
npm install                      # 1. Instala las dependencias
cp .env.example .env             # 2. Crea el archivo de variables (ya trae valores de demo)
npx prisma migrate dev           # 3. Crea la base de datos SQLite (prisma/nexo.db) y corre el seed
npm run seed                     # 4. (Opcional) vuelve a cargar los datos de Tienda Óptica
npm run dev                      # 5. Abre http://localhost:3000
```

- **Panel de clientes:** http://localhost:3000/panel → usuario `demo@tiendaoptica.co`, contraseña `nexo2026` (o el botón «Usar la cuenta demo»).
- **Sin claves externas funciona todo:** sin `RESEND_API_KEY` el formulario guarda el lead y muestra éxito; sin `ANTHROPIC_API_KEY` Vera responde con respuestas predefinidas; sin IDs de GA4/Meta no se carga analítica.

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run build` y `npm start` | Versión de producción (optimizada). |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run typecheck` | Revisa los tipos de TypeScript. |
| `npm run test:e2e` | 61 pruebas con Playwright en escritorio y móvil (SEO, accesibilidad, flujos). Requiere `npm run build` y la base con datos; levanta el servidor en el puerto 3100. |
| `npm run capturas` | Toma capturas de todas las páginas en 375, 768 y 1440 px → `docs/capturas/`. |
| `npm run lighthouse` | Auditoría Lighthouse en móvil de Inicio, Servicios, Blog y Contacto → `docs/lighthouse/` (con `npm start -- -p 3100` corriendo). |
| `npm run db:reset` | Borra la base, la recrea y vuelve a sembrar los datos. |

Si ya tienes Chrome/Chromium instalado, puedes indicarlo con `CHROMIUM_PATH` (pruebas) o `CHROME_PATH` (Lighthouse).

### Variables de entorno (`.env.example`)

| Variable | Para qué sirve | ¿Obligatoria? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Dominio para canonical, sitemap y Open Graph. | Sí (trae uno de ejemplo) |
| `DATABASE_URL` | Ruta de la base SQLite (o URL de PostgreSQL). | Sí |
| `AUTH_SECRET` | Firma de la sesión del panel (mínimo 32 caracteres). | Sí en producción |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Envío del correo de cada lead con Resend. | No |
| `ANTHROPIC_API_KEY` | Respuestas de Vera con Claude. | No |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Analítica, solo si el visitante acepta cookies. | No |

**Publicar en internet (Netlify + PostgreSQL):** sigue la guía paso a paso en [`docs/publicar-en-netlify.md`](docs/publicar-en-netlify.md). El repositorio ya trae `netlify.toml` y `prisma/schema.postgres.prisma`; en local se sigue usando SQLite.

---

## Estructura de carpetas

```
app/                      Páginas y API (Next.js App Router). Cada carpeta es una URL.
  page.tsx                Inicio (/)
  nosotros/ servicios/ planes/ blog/ portafolio/ contacto/
  privacidad/ terminos/ cookies/
  panel/                  Panel de clientes (protegido) y panel/ingresar (login)
  api/                    Backend: contact, newsletter, auth, dashboard, vera
  sitemap.ts robots.ts llms.txt/ opengraph-image.tsx not-found.tsx
components/
  layout/                 Header, footer, breadcrumbs, cookies, botones flotantes
  sections/               Bloques de las páginas (hero, tarjetas, diagrama, FAQ…)
  forms/                  Formularios de contacto, boletín y solicitud rápida
  panel/                  Dashboard y login del panel
  vera/                   Widget de chat de Vera
  blog/ motion/ ui/ seo/ lazy/
content/blog/             Los 4 artículos del blog en MDX
lib/
  content/                Textos de servicios, planes, equipo, caso y FAQ (una sola fuente)
  schemas.ts              Validaciones Zod compartidas por navegador y servidor
  dashboard.ts            Cálculo de métricas del panel
  vera.ts                 Lógica de Vera (Claude o respuestas por intención)
  auth.ts session.ts rate-limit.ts mailer.ts seo.ts jsonld.ts site.ts
prisma/                   Esquema de la base, migraciones y seed de Tienda Óptica
tests/                    Pruebas Playwright
scripts/                  Lighthouse y generador de las tablas SEO/UX
docs/                     Tablas SEO y UX, omnicanalidad, bitácora de IA, capturas, Lighthouse
archivo/lista-tareas/     Proyecto anterior (app de tareas), conservado como archivo
```

---

## Cómo funciona el frontend y el backend

Esta sección está escrita para explicarla en clase, sin jerga.

### La idea general

Un sitio web tiene dos partes:

- **Frontend (la vitrina):** lo que ve la persona en el navegador, como textos, botones, formularios y gráficas.
- **Backend (la bodega y la oficina):** lo que pasa en el servidor. Ahí se guardan los datos, se revisa quién puede entrar al panel, se calculan las métricas y se responde el chat.

En NEXO las dos partes viven en el mismo proyecto de **Next.js**. Las páginas están en `app/` y el backend está en `app/api/`.

### Frontend: por qué el HTML llega completo

Un sitio hecho solo con React le entrega al navegador una página casi vacía y la «arma» con JavaScript. Google puede leerla, pero tarda más y a veces ve menos contenido.

Next.js hace lo contrario: **genera el HTML en el servidor**. Cuando Google o una persona pide `/servicios`, recibe de una vez los títulos, los textos, los enlaces y los datos estructurados. Por eso es la elección correcta para un taller de SEO.

- **Server Components (por defecto):** las páginas se generan en el servidor, algunas incluso al compilar, y no envían JavaScript innecesario.
- **Client Components (solo donde hay interacción):** menú móvil, formularios, filtros del blog, diagrama omnicanal, chat de Vera y gráficas del panel.
- **Diseño:** Tailwind CSS con tokens de color extraídos del logo (`app/globals.css`). Las animaciones usan Framer Motion y CSS, y respetan la opción del sistema de «reducir movimiento».

### Cómo viaja un dato del formulario a la base de datos

1. La persona llena el formulario de `/contacto` y ve los errores en vivo, junto a cada campo. El navegador valida con el esquema de `lib/schemas.ts` (Zod + React Hook Form).
2. Al enviar, el navegador manda los datos en formato JSON a `POST /api/contact`.
3. El servidor revisa varias cosas antes de guardar:
   - que la misma IP no esté enviando demasiadas solicitudes (*rate limiting*);
   - que el campo trampa invisible esté vacío (*honeypot* contra bots);
   - y **vuelve a validar con el mismo esquema Zod**, porque nunca se confía solo en el navegador.
4. Normaliza los datos (Ley de Postel): el correo queda en minúsculas y el teléfono en formato `+57XXXXXXXXXX`, sin importar cómo se escribió.
5. Guarda el registro en la tabla `Lead` con **Prisma**, la herramienta que traduce código TypeScript a consultas SQL.
6. Si hay clave de Resend, envía un correo al equipo. Si no, no pasa nada: el lead ya quedó guardado.
7. Responde `201` con el mensaje «¡Mensaje enviado! Te contactamos en menos de 24 horas hábiles.», que el formulario muestra en pantalla.

### Cómo el panel pide y muestra las métricas

1. **Login:** `POST /api/auth/login` compara la contraseña con su versión cifrada (bcrypt). Si coincide, crea una **cookie de sesión firmada** (JWT con `jose`), que JavaScript no puede leer (`httpOnly`).
2. **Protección:** `middleware.ts` revisa esa cookie antes de abrir `/panel` o `/api/dashboard/*`. Sin sesión válida, redirige al login.
3. **Primera carga:** el servidor calcula las métricas en `lib/dashboard.ts` y la página llega con los números ya puestos, sin pantalla de «cargando».
4. **Filtros:** al cambiar las fechas o el canal, el navegador llama a `GET /api/dashboard/metrics?from=…&to=…&channel=…`. El servidor:
   - lee las métricas diarias de la tabla `Metric`;
   - suma por período, canal y etapa del embudo;
   - compara con el período anterior y con la línea base de la meta;
   - y escribe la lectura de Vera con reglas simples y explicables.
5. **Seguridad:** el cliente de cada consulta sale de la sesión y nunca de la URL, así nadie puede ver los datos de otra marca.
6. **Exportar CSV:** `GET /api/dashboard/export?format=csv` devuelve las filas del período con separador `;`, que Excel en español abre sin problema.

### Vera, la agente de IA

El chat llama a `POST /api/vera`:

- **Con `ANTHROPIC_API_KEY`:** el servidor le pregunta a Claude (modelo `claude-opus-5`, esfuerzo bajo para responder rápido). Le envía un *system prompt* con los servicios, los planes, el caso y reglas claras: no inventar precios y aclarar que las cifras son simuladas.
- **Sin clave, o si la API falla:** responde con respuestas predefinidas según la intención detectada (servicios, planes, casos, asesoría, contacto, panel).

La demo funciona igual en los dos casos.

### Por qué se eligió cada tecnología

| Tecnología | Por qué |
|---|---|
| **Next.js 15 + TypeScript** | HTML generado en servidor (SEO), metadatos por página, sitemap y robots nativos, frontend y API en un solo proyecto. TypeScript evita errores de tipos. |
| **Tailwind CSS** | Sistema de diseño con tokens (colores, tipografía fluida) aplicado de forma consistente (Ley de Semejanza). |
| **Framer Motion** | Microinteracciones (aparición, contadores, cursor magnético) que respetan `prefers-reduced-motion`. |
| **Radix UI** | Menú, acordeón, modales e interruptores accesibles con teclado y lector de pantalla. |
| **React Hook Form + Zod** | Validación en vivo en el navegador y la misma validación en el servidor. |
| **Prisma + SQLite** | Base fácil de correr en la exposición (un archivo). Pasar a PostgreSQL es cambiar una línea. |
| **jose + bcryptjs** | Sesión segura en cookie httpOnly y contraseñas cifradas. |
| **Recharts** | Gráficas del panel, con tabla de datos alternativa para accesibilidad. |
| **MDX** | Artículos del blog escritos como texto, con tablas y enlaces, versionados en Git. |
| **Playwright + axe + Lighthouse** | Pruebas automáticas de flujos, accesibilidad (WCAG 2.2 AA), SEO y rendimiento. |

---

## Resultados de calidad

- **Pruebas E2E:** 61 pruebas pasan en escritorio (1440 px) y móvil (375 px). Cubren el title de 60 caracteres o menos, la meta descripción de 120 a 155, un solo H1, la jerarquía de encabezados, el alt en las imágenes, el canonical, Open Graph, el JSON-LD, axe sin violaciones serias ni críticas, todos los CTA, el formulario, el panel, el CSV, las cookies y Vera.
- **Lighthouse en móvil** (`docs/lighthouse/`):

  | Página | Performance | Accesibilidad | Buenas prácticas | SEO |
  |---|---|---|---|---|
  | Inicio | 94 | 100 | 100 | 100 |
  | Servicios | 94 | 100 | 100 | 100 |
  | Blog | 95 | 100 | 100 | 100 |
  | Contacto | 96 | 100 | 100 | 100 |

  En la simulación de Lighthouse (móvil con 4G lenta), el CLS es 0,035 y el TBT está entre 80 y 140 ms. El LCP simulado queda entre 2,5 y 2,9 s: cumple la meta de 2,5 s solo en Contacto, justo en el límite. En la medición sin limitación de red, el LCP real es de ~0,2 s en local. Para comprobarlo con usuarios reales, hay que medir con PageSpeed Insights cuando el sitio esté publicado.

---

## Documentación

- [`docs/tabla-seo.md`](docs/tabla-seo.md) y [`docs/tabla-seo.csv`](docs/tabla-seo.csv): los 15 parámetros SEO con «Cómo lo apliqué en mi sitio web».
- [`docs/tabla-ux.md`](docs/tabla-ux.md) y [`docs/tabla-ux.csv`](docs/tabla-ux.csv): las 9 leyes de UX con «Cómo lo apliqué en mi sitio».
- `docs/Tabla de parámetros SEO y UX - diligenciada.xlsx`: el Excel de la profesora con la columna llena.
- [`docs/omnicanalidad.md`](docs/omnicanalidad.md): cómo se integran web, redes, WhatsApp, email, tienda física y panel.
- [`docs/bitacora-ia.md`](docs/bitacora-ia.md): herramientas de IA, prompts, ajustes.
- [`docs/publicar-en-netlify.md`](docs/publicar-en-netlify.md): cómo publicar el sitio en Netlify, paso a paso.
- `docs/capturas/` y `docs/lighthouse/`: evidencias.
