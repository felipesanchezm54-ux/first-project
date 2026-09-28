# Bitácora de uso de inteligencia artificial

Registro de las herramientas de IA usadas para construir el sitio de NEXO: para qué se usaron, con qué instrucciones y qué se ajustó.

## Herramientas

| Herramienta | Para qué se usó |
|---|---|
| **Claude Code** (agente de programación de Anthropic, en la nube) | Plan del sitio (Fase 1), código completo del frontend y del backend, contenido de las páginas y del blog, pruebas automáticas, auditorías de calidad y esta documentación. |
| **API de Claude** (dentro del sitio) | Motor opcional de **Vera**, el chat del sitio (`lib/vera.ts`), cuando existe `ANTHROPIC_API_KEY`. Sin clave, Vera usa respuestas predefinidas. |
| **Herramientas automáticas de verificación** (no son IA generativa) | Playwright, axe-core y Lighthouse, usadas para comprobar lo que produjo la IA. |

## Prompt principal

El equipo escribió un prompt de trabajo por fases: *«PROMPT PARA CLAUDE CODE — Sitio web de NEXO (agencia de marketing digital)»*. Incluía:

- **Rol:** equipo senior de producto (UX/UI, desarrollo full-stack, SEO/GEO/AEO) y trabajo por fases, con aprobación del plan antes de escribir código.
- **Contexto de la marca:** NEXO, equipo, Vera y valores. También el cliente Tienda Óptica y todo lo que se hizo en el curso: branding, benchmark, DOFA, journey, captura de datos, email, contenido, embudo con lead scoring y landing.
- **Dirección de diseño:** inspiración en ringofire.com, pero con la cifra siempre al lado del caso.
- **Stack técnico:** Next.js, Prisma, API, autenticación y Vera.
- **Contenido:** mapa del sitio y contenido de cada página.
- **SEO/GEO/AEO:** keyword por página, los 15 parámetros de la tabla de la profesora, las 9 leyes de UX y WCAG 2.2 AA.
- **Pruebas y entregables:** pruebas, capturas, Lighthouse y documentación.

### Prompts de seguimiento

1. *«Usa los valores por defecto, y antes de que realices. ¿Cuál Excel te refieres?»* Aclaró cuál era la tabla de parámetros y aprobó los valores por defecto propuestos en la Fase 1:
   - la app de tareas se mueve a `archivo/`;
   - precios de referencia;
   - datos de contacto de ejemplo;
   - Next.js 15.
2. *«Ahora sí, go ahead, además utiliza los colores de la agencia»* (junto con el logo y el Excel). Aprobó el plan y pidió usar los colores del logo.

### Por qué se usó IA

- Para construir en poco tiempo un sitio completo, con backend, panel y pruebas, que un equipo de estudiantes de marketing no programaría desde cero dentro del taller.
- Para aplicar de forma sistemática y verificable los 15 parámetros SEO y las 9 leyes de UX: cada uno quedó conectado con un archivo del código y una prueba.
- Para redactar un primer borrador del contenido, que el equipo revisa y ajusta (ver la sección vacía al final).

## Decisiones y ajustes que hizo la IA durante el trabajo (y por qué)

| Ajuste | Motivo |
|---|---|
| Colores tomados del logo (`#085042`, `#1F9E75`, `#7F77DC`) y derivados para fondo oscuro y claro | Los tonos originales no alcanzan 4,5:1 de contraste en todos los fondos; los derivados cumplen WCAG AA. Relaciones calculadas antes de usarlos. |
| Se cambió el acento cálido propuesto (ámbar) por un teal eléctrico de la marca | El equipo pidió usar los colores de la agencia. |
| Paleta de gráficas validada con un verificador de daltonismo y contraste | El panel debe leerse con cualquier tipo de visión. |
| Las cifras del caso (+17,9 %, 1.130 leads, CPL de $14.200 a $9.500) se recalcularon con los datos del panel | Al principio el texto y el panel no coincidían; ahora salen de la misma simulación. |
| Se quitó una cifra de «referencia del sector» para la apertura de email | No tenía fuente verificable (regla: cifras con contexto y fuente). |
| Se marcaron como «ilustrativos» todos los testimonios y resultados | Los datos son simulados con fines académicos; presentarlos como reales sería engañoso. |
| Se corrigieron fallas encontradas por las pruebas automáticas: desborde horizontal en móvil, tablas desplazables sin acceso con teclado, imagen Open Graph ausente en páginas internas, violación de la CSP por Zod | Las pruebas de axe, Playwright y Lighthouse las detectaron antes de entregar. |
| Se probó no precargar la fuente de titulares y se revirtió | Mejoraba el LCP, pero empeoraba el CLS (0,035 → 0,19). |
| El botón del hero conserva el texto pedido, «Ver resultados reales» | Es la redacción del prompt. El caso al que lleva aclara que las cifras son simuladas. **Sugerencia para el equipo:** cambiarlo por «Ver el caso completo» si prefieren evitar ambigüedad. |

## Límites conocidos

- Las cifras del panel y del caso son **simuladas**; los entregables del caso (branding, benchmark, DOFA, journey, flujos, parrilla) sí corresponden al trabajo del curso.
- Los datos de contacto (`hola@nexo.example`, `+57 300 000 0000`, dirección y redes) son **de ejemplo**. Se cambian en `lib/site.ts`.
- Los precios de los planes son **de referencia** y deben validarse.
- Las keywords son propuesta inicial. El volumen y la dificultad los valida el equipo en la hoja «KWS elegidas»; la IA no inventó volúmenes.
- Los textos legales (privacidad, términos, cookies) son una base para Colombia y deben pasar por revisión legal antes de publicarse.
- El LCP simulado de Lighthouse (4G lenta) queda entre 2,5 y 2,9 s. Hay que medirlo con usuarios reales en PageSpeed Insights cuando el sitio esté publicado.

## Ajustes manuales del equipo

<!-- Esta sección la completa el equipo de NEXO (Felipe, Martín, Sofía, María Isabel). Sugerencia: fecha · qué se cambió · por qué. -->

| Fecha | Integrante | Qué se ajustó | Por qué |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
