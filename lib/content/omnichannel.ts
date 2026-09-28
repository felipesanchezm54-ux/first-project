export type Channel = {
  id: string;
  name: string;
  short: string;
  role: string;
  feeds: string;
  /** Posición en el diagrama (porcentaje del contenedor). */
  x: number;
  y: number;
};

/** Integración omnicanal: cada canal cumple un rol y alimenta un dato al panel. */
export const channels: Channel[] = [
  {
    id: "web",
    name: "Sitio web",
    short: "Web",
    role: "Es la casa de la marca: recibe el tráfico de redes, pauta y buscadores, y convierte con formularios, quiz y botón de WhatsApp.",
    feeds: "Visitas, leads por formulario, conversiones de la landing y origen del tráfico (UTM).",
    x: 18,
    y: 22,
  },
  {
    id: "redes",
    name: "Instagram · Facebook · TikTok",
    short: "Redes",
    role: "Atraen e interactúan: reels, carruseles e historias que llevan a la web o directo a WhatsApp.",
    feeds: "Alcance, seguidores nuevos, interacción y clics al enlace de la bio.",
    x: 82,
    y: 22,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    short: "WhatsApp",
    role: "Cierra la venta: agenda exámenes y resuelve dudas con mensajes prellenados que identifican de dónde viene cada contacto.",
    feeds: "Clics a WhatsApp, conversaciones iniciadas y citas agendadas.",
    x: 90,
    y: 62,
  },
  {
    id: "email",
    name: "Email (Mailchimp)",
    short: "Email",
    role: "Fideliza: bienvenida, posventa, carrito abandonado, mantenimiento a 6 meses y renovación de fórmula a 12 meses.",
    feeds: "Tasa de apertura, clics, recompras y puntos de lead scoring por interacción.",
    x: 10,
    y: 62,
  },
  {
    id: "tienda",
    name: "Tienda física (QR del Club)",
    short: "Tienda",
    role: "Conecta lo físico con lo digital: el QR del Club Tienda Óptica registra al cliente en caja y activa su garantía digital.",
    feeds: "Registros al Club, garantías activadas y ventas atribuidas a campañas.",
    x: 50,
    y: 90,
  },
];

export const panelNode = {
  id: "panel",
  name: "Panel de resultados",
  role: "Reúne los datos de todos los canales, calcula el lead scoring y muestra el avance hacia la meta. Vera lo lee y propone ajustes.",
  feeds: "Todo lo anterior, en un solo lugar, filtrable por fecha y canal.",
};
