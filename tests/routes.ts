export const publicRoutes = [
  "/",
  "/nosotros",
  "/servicios",
  "/planes",
  "/blog",
  "/blog/embudo-de-marketing-digital-para-pymes",
  "/blog/cada-cuanto-publicar-en-redes-sociales",
  "/blog/cuanto-invertir-en-meta-ads-al-empezar",
  "/blog/habeas-data-para-pymes-ley-1581",
  "/portafolio",
  "/portafolio/tienda-optica",
  "/contacto",
  "/privacidad",
  "/terminos",
  "/cookies",
];

/** Guarda la decisión de cookies para que el banner no tape la página en las pruebas. */
export const consentCookie = {
  name: "nexo_consent",
  value: encodeURIComponent(JSON.stringify({ analytics: false, marketing: false, date: "2026-09-27T00:00:00.000Z" })),
  url: "http://localhost:3100",
};
