# PRCPTA · Prototipo 1 (landing que mide su propia atención)

Landing de validación con expertos. La página es el primer estudio de atención de PRCPTA: mide, con consentimiento, cómo los visitantes miran nuestra propia oferta y recoge la opinión estructurada de cada experto vinculada a su sesión.

## Estructura

```
index.html          Landing (cada sección tiene data-aoi)
gracias.html        Confirmación del formulario de contacto
privacidad.html     Política de datos (Ley 1581 de 2012, Decreto 1377 de 2013)
panel.html          Panel de resultados (/panel, con contraseña)
404.html
css/landing.css     Diseño de la landing (index.html)
css/site.css        Estilos de gracias, privacidad, 404 y base del panel
css/panel.css       Estilos del panel
js/tracker.js       Rastreador propio (sin librerías)
js/main.js          Consentimiento, ojo del hero, demo 3D, comparador, proceso, formulario por pasos, modo experto
js/lab.js           Modo laboratorio con WebGazer.js (se carga solo al activarlo)
js/panel.js         Indicadores, mapas de calor en canvas, embudo, exportación
netlify/functions/collect.mjs     Recibe lotes y guarda en Netlify Blobs
netlify/functions/panel-data.mjs  Agrega los datos para el panel
netlify.toml
og.png, favicon.svg
```

## Datos que se guardan

Netlify Blobs, almacén `prcpta`, clave `sesiones/AAAA-MM-DD/{session_id}.json` (fecha de Bogotá). Cada sesión contiene:

| Campo | Qué es |
|---|---|
| `session_id`, `started` | Identificador aleatorio (sessionStorage) y hora de inicio |
| `device` | `type` (computador, tableta, celular), `w`, `h`, `utm`, `experto` |
| `aoi_ms` | Milisegundos visibles por sección (≥ 50 % en pantalla) |
| `scroll_max`, `scroll` | Profundidad máxima y marcas 25/50/75/100 |
| `moves`, `clicks`, `gaze` | `[aoi, relX, relY, t]`: coordenadas relativas a la sección ×1000 y tiempo en décimas de segundo |
| `events` | `visita`, `demo_completada`, `clic_precios`, `clic_cta`, `form_inicio`, `form_envio`, `opinion_enviada`, `lab_*`… |
| `opinion` | Opinión del experto (si la envió con la medición activa) |

No se guarda la IP. El formulario de contacto (Netlify Forms) no lleva `session_id`, así que el correo nunca se cruza con los eventos.

## Configurar `PANEL_PASSWORD`

Con Netlify CLI:

```bash
netlify env:set PANEL_PASSWORD "una-contraseña-larga"
```

```bash
netlify deploy --prod
```

O en la interfaz: **Site configuration → Environment variables → Add a variable**, nombre `PANEL_PASSWORD`, alcance *Functions*. Después vuelve a desplegar. Sin esta variable el panel responde «Falta configurar PANEL_PASSWORD».

## Probar en local

```bash
npm install
```

```bash
PANEL_PASSWORD=prueba netlify dev
```

Abre `http://localhost:8888`. En local, Blobs usa un almacén temporal; Netlify Forms solo procesa envíos en el sitio desplegado (en local el envío a `/` responde 405, es normal).

## Ver los formularios

Netlify detecta los formularios `contacto` y `opinion-experto` al desplegar. Los envíos están en **Netlify → tu sitio → Forms**. Para recibir un correo por cada envío: **Forms → Form notifications → Add notification → Email notification**.

## Compartir el enlace de experto

Comparte `https://TU-SITIO.netlify.app/?experto=1`. Aparece el botón flotante «Dar mi opinión» y el bloque de evaluación al final. Para distinguir canales, agrega `utm_source`, por ejemplo `?experto=1&utm_source=linkedin` o `&utm_source=whatsapp`.

Para que la opinión quede vinculada a lo que la persona miró, debe aceptar la medición en el aviso inicial. Si elige «Solo navegar», la opinión llega igual a Netlify Forms, pero sin sesión.

## Panel y exportación

`https://TU-SITIO.netlify.app/panel` → contraseña. Incluye indicadores, reparto de la atención (alerta si propuesta de valor, precios o llamado reciben menos del 15 %), embudo, mapas de calor por sección (cursor, clics, mirada; por dispositivo o por sesión), opiniones con su mapa y las sesiones recientes.

- **Exportar CSV:** una fila por sesión, separador `;` y coma decimal (abre bien en Excel en español).
- **Exportar JSON:** todos los datos crudos y agregados, para análisis en el documento académico.

## Despliegue

```bash
netlify login
```

```bash
netlify init
```

```bash
netlify deploy --prod
```

Netlify Drop no sirve: no ejecuta funciones.

## Reglas de contenido

Sin testimonios, logos, clientes ni cifras inventadas. La marca de la demo (Vereda Lumbre) es ficticia y está rotulada. Los casos son ilustrativos. Los precios son de referencia del piloto.
