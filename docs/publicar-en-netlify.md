# Publicar el sitio de NEXO en Netlify

Guía paso a paso, sin necesidad de programar. Tiempo estimado: 15–20 minutos.

**Qué vas a usar (todo gratis):**
- **Neon** (neon.tech): la base de datos PostgreSQL donde se guardan los leads y los datos del panel.
- **Netlify** (netlify.com): donde queda publicado el sitio, con un link público y HTTPS.

El repositorio ya está preparado. `netlify.toml` le dice a Netlify cómo compilar. Durante la compilación, `prisma/schema.postgres.prisma` crea las tablas y el seed carga los datos de Tienda Óptica la primera vez.

---

## Parte 1 · Crear la base de datos en Neon

1. Entra a **https://neon.tech** y haz clic en **Sign up**. Elige **Continue with GitHub** (usa la misma cuenta del repositorio).
2. Neon te pide crear un proyecto:
   - **Project name:** `nexo`
   - **Postgres version:** deja la que aparece por defecto.
   - **Region:** elige **AWS US East 2 (Ohio)**. Es la misma región donde Netlify corre las funciones, así el sitio responde más rápido.
   - Clic en **Create project**.
3. En el panel del proyecto, haz clic en el botón **Connect** (arriba a la derecha).
4. En la ventana que se abre:
   - Busca el interruptor **Connection pooling** y **apágalo**, para usar la conexión directa.
   - Copia la cadena de conexión completa. Se ve así:
     ```
     postgresql://neondb_owner:AbC123xyz@ep-algo-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - Guárdala en un bloc de notas: es tu **`DATABASE_URL`**. Contiene la contraseña, así que no la compartas.

## Parte 2 · Preparar la clave secreta del panel

El panel necesita una clave secreta para firmar las sesiones. Inventa una cadena larga y aleatoria de **al menos 32 caracteres, sin espacios**. Por ejemplo, teclea al azar letras, números y guiones:

```
nexo-Q8r2ZpL0x7-vT4mK9sW1-hJ6yB3nC5dF
```

(No uses exactamente este ejemplo.) Guárdala en el bloc de notas: es tu **`AUTH_SECRET`**.

## Parte 3 · Crear el sitio en Netlify

1. Entra a **https://app.netlify.com** y haz clic en **Sign up**. Elige **GitHub**.
2. En el panel, haz clic en **Add new project** (o **Add new site**) → **Import an existing project**.
3. Elige **GitHub**. Si te pide permisos, autoriza a Netlify a ver tus repositorios; puedes darle acceso solo a `first-project`.
4. Selecciona el repositorio **`felipesanchezm54-ux/first-project`**.
5. En la pantalla de configuración:
   - **Branch to deploy:** elige **`claude/practical-johnson-78o4qt`**. Si antes unes la rama a `main` con un pull request, elige `main`.
   - **Build command** y **Publish directory:** no los toques; Netlify los lee de `netlify.toml`.
   - **Project name:** si aparece, escribe algo como `nexo-agencia`. Tu link quedará como `https://nexo-agencia.netlify.app`.
6. Busca **Add environment variables** (o **Environment variables**) en esa misma pantalla y agrega dos:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | la cadena de conexión de Neon (Parte 1) |
   | `AUTH_SECRET` | tu clave secreta (Parte 2) |

7. Clic en **Deploy**.

## Parte 4 · Esperar y comprobar

1. Netlify empieza a compilar; tarda **3 a 6 minutos**. Puedes ver el avance en **Deploys** → el despliegue en curso → **Deploy log**. Todo va bien si en el log aparecen:
   - `Your database is now in sync with your Prisma schema`
   - `✓ Seed completo. Usuario demo: demo@tiendaoptica.co / nexo2026`
   - `✓ Generating static pages`
2. Cuando diga **Published**, abre el link de tu sitio.
3. Prueba:
   - El **inicio** y el menú.
   - El **formulario de contacto**: envía uno de prueba.
   - El **panel**: `…/panel`, usuario `demo@tiendaoptica.co`, contraseña `nexo2026`. Cambia los filtros y exporta el CSV.
   - El **chat de Vera**.

> La primera visita después de un rato sin uso puede tardar unos segundos: la base gratuita de Neon «se duerme» y despierta con la primera consulta.

## Parte 5 · Ajustes opcionales

- **Cambiar el nombre del link:** en Netlify, **Project configuration → General → Change project name**. Después haz un nuevo despliegue (**Deploys → Trigger deploy → Deploy project**) para que el sitemap y los canonical usen el nombre nuevo.
- **Activar Vera con IA:** agrega la variable `ANTHROPIC_API_KEY` con tu clave de la consola de Anthropic y vuelve a desplegar. Sin ella, Vera funciona con respuestas predefinidas.
- **Recibir los leads por correo:** crea una cuenta en resend.com y agrega `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` y `CONTACT_TO_EMAIL`.
- **Analítica:** agrega `NEXT_PUBLIC_GA4_ID` y/o `NEXT_PUBLIC_META_PIXEL_ID`. Solo se cargan si el visitante acepta cookies.
- **Dominio propio** (por ejemplo `nexo.com.co`): **Domain management → Add a domain**. Luego agrega la variable `NEXT_PUBLIC_SITE_URL=https://tudominio` y vuelve a desplegar.

Cada vez que cambies una variable de entorno, haz **Deploys → Trigger deploy → Clear cache and deploy project** para que se apliquen.

## Si algo falla

| Mensaje en el log o síntoma | Qué hacer |
|---|---|
| `P1001: Can't reach database server` | La `DATABASE_URL` está mal copiada o incompleta. Cópiala de nuevo desde **Connect** en Neon, con **Connection pooling** apagado, y vuelve a desplegar. |
| `Environment variable not found: DATABASE_URL` | No se guardó la variable. Agrégala en **Project configuration → Environment variables** y vuelve a desplegar. |
| `AUTH_SECRET debe tener al menos 32 caracteres` | La clave es muy corta; usa una más larga. |
| El panel dice que el correo o la contraseña no coinciden | Revisa en el log que aparezca `Seed completo`. Si no, vuelve a desplegar con **Clear cache and deploy project**. |
| El sitio abre pero el formulario da error | Revisa **Logs → Functions** en Netlify; casi siempre es la `DATABASE_URL`. |

## Qué cambió en el repositorio para Netlify

- `netlify.toml`: comando de compilación y versión de Node.
- `prisma/schema.postgres.prisma`: el mismo modelo de datos, pero con PostgreSQL. En tu computador se sigue usando SQLite con `prisma/schema.prisma`.
- `package.json` → script `build:netlify`: genera el cliente de Prisma, crea las tablas (`prisma db push`), carga los datos solo si la base está vacía y compila.
- `lib/site.ts`: si no defines `NEXT_PUBLIC_SITE_URL`, usa la URL que Netlify entrega al compilar.

Este flujo se probó antes de publicarlo: compilación contra un PostgreSQL real y 27 pruebas de flujos pasadas (formulario, login, panel, filtros y CSV).
