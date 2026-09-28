# Integración omnicanal de NEXO

**Omnicanalidad** significa que todos los canales de una marca (sitio web, redes, WhatsApp, email y tienda física) funcionan como un solo sistema. Cada canal tiene un trabajo distinto dentro del embudo, reconoce al mismo cliente y **envía sus datos al mismo lugar**: el panel de resultados.

Así funciona en la estrategia que NEXO diseñó para Tienda Óptica. En el sitio se ve de forma interactiva en [`/servicios#omnicanalidad`](../app/servicios/page.tsx) (componente `components/sections/omnichannel-diagram.tsx`).

```
                 Instagram · Facebook · TikTok
                           │  (atracción)
                           ▼
   Email (Mailchimp) ◄── Sitio web / landing ──► WhatsApp Business
     (fidelización)      (interacción)             (conversión)
           │                  │                         │
           └────────► PANEL DE RESULTADOS ◄─────────────┘
                              ▲        (Vera lee los datos)
                              │
                   Tienda física (QR del Club)
```

## El rol de cada canal y el dato que alimenta al panel

| Canal | Etapa principal del embudo | Rol | Dato que envía al panel |
|---|---|---|---|
| **Sitio web / landing** | Interacción | Casa de la marca: recibe el tráfico de redes, pauta y Google. Convierte con formularios, quiz de estilo visual, guía descargable y botón de WhatsApp. | Visitas, leads por formulario, conversiones de la landing y origen del tráfico (UTM). |
| **Instagram · Facebook · TikTok** | Atracción | Reels, carruseles e historias del pilar educativo (arquetipo El Sabio) que llevan a la web o directo a WhatsApp. Pauta de Meta Ads y remarketing. | Alcance, seguidores nuevos, interacción, clics al enlace e inversión. |
| **WhatsApp Business** | Conversión | Cierra la venta: agenda exámenes y resuelve dudas. Cada botón abre con un **mensaje prellenado** distinto según la página o campaña, así se sabe de dónde viene la conversación. | Clics a WhatsApp, conversaciones iniciadas y citas agendadas. |
| **Email (Mailchimp)** | Fidelización | 5 flujos automáticos: bienvenida, posventa, carrito abandonado, mantenimiento a 6 meses y renovación de fórmula a 12 meses. | Enviados, aperturas, clics, recompras y puntos de lead scoring. |
| **Tienda física (QR del Club)** | Fidelización y conversión | El QR en caja registra al cliente en el Club Tienda Óptica y activa su garantía digital. Así se conectan la compra física y la base de datos. | Registros al Club, garantías activadas y ventas atribuidas a campañas. |
| **Panel de resultados** | Medición | Reúne todo, calcula el lead scoring, compara contra la meta (+20 % de conversión digital en 6 meses) y muestra el estado de las campañas. **Vera** lo lee y propone ajustes. | Todo lo anterior, filtrable por fecha y canal y exportable a CSV. |

## Un cliente, un recorrido: ejemplo

1. Laura ve en **Instagram** un reel sobre cada cuánto cambiar la fórmula (atracción).
2. Entra a la **landing** y hace el quiz de estilo visual. Deja su correo con autorización de Habeas Data y entra a la banda «interesado» del lead scoring (interacción).
3. Recibe el **flujo de bienvenida** con la guía «Cómo leer tu fórmula».
4. Hace clic en **WhatsApp** con el mensaje prellenado de la campaña y agenda su examen; el anuncio de remarketing le recordó que el parqueo es gratis con cita (conversión).
5. En la **tienda** escanea el QR del Club al pagar y activa la garantía (fidelización).
6. A los 6 meses le llega el correo de **mantenimiento** y a los 12 el de **renovación de fórmula**.
7. En el **panel**, la óptica ve el recorrido completo: qué canal trajo a Laura, cuánto costó ese lead y en qué banda está hoy.

## Cómo se implementa técnicamente

- **Identificación del origen:** enlaces con parámetros UTM en redes y pauta. En WhatsApp, un mensaje prellenado distinto por fuente (función `whatsappUrl()` en `lib/site.ts`). En tienda, un QR con un parámetro de sede.
- **Consentimiento:** todos los puntos de captura piden autorización previa, expresa e informada (Ley 1581 de 2012). En el sitio, la casilla de Habeas Data es obligatoria y la de comunicaciones comerciales va aparte (`components/forms/contact-form.tsx`).
- **Almacenamiento:** en esta propuesta académica, las métricas diarias por canal viven en la tabla `Metric` (Prisma) y los leads del sitio en `Lead`. En producción, las métricas llegarían por integraciones: API de Meta, Mailchimp, WhatsApp Business Platform y GA4.
- **Lectura:** `GET /api/dashboard/metrics` suma por canal, etapa y período, y Vera escribe la lectura automática (`lib/dashboard.ts`).
- **Privacidad de la medición:** GA4 y Meta Pixel solo se cargan si la persona acepta las cookies (`components/layout/consent-scripts.tsx`).

> Las cifras del panel son simuladas con fines académicos y están marcadas como «Datos de demostración».
