import { Bot, Compass, Lightbulb, Target, HeartHandshake, Sparkles, type LucideIcon } from "lucide-react";

export type TeamMember = {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  initials: string;
  isAI?: boolean;
  color: "green" | "teal" | "purple";
};

export const team: TeamMember[] = [
  {
    name: "Felipe",
    role: "Content Curator",
    specialty: "Curaduría de contenido y pilares editoriales",
    bio: "Decide qué se publica y por qué. Convierte las preguntas reales de los clientes en temas de contenido y cuida que cada pieza tenga un objetivo del embudo.",
    initials: "F",
    color: "green",
  },
  {
    name: "Martín",
    role: "Especialista SEO",
    specialty: "SEO técnico, keywords y AEO",
    bio: "Se encarga de que Google y los buscadores con IA entiendan cada página: estructura, velocidad, datos estructurados y respuestas citables.",
    initials: "M",
    color: "teal",
  },
  {
    name: "Sofía",
    role: "Copywriter",
    specialty: "Tono de voz y textos que convierten",
    bio: "Escribe los titulares, correos y anuncios. Su regla: cada frase tiene que decir algo concreto o se borra.",
    initials: "S",
    color: "purple",
  },
  {
    name: "María Isabel",
    role: "Social Media Manager",
    specialty: "Comunidad, parrillas y formatos",
    bio: "Planea las parrillas, publica en Instagram, Facebook y TikTok, responde a la comunidad y mide qué formato lleva a la gente a WhatsApp.",
    initials: "MI",
    color: "green",
  },
  {
    name: "Vera",
    role: "Estratega de Datos e Insights",
    specialty: "Agente de IA de NEXO",
    bio: "Lee los datos del panel todos los días y los convierte en lecturas en lenguaje sencillo: qué subió, qué bajó y qué conviene hacer. También responde tus preguntas en el chat.",
    initials: "V",
    isAI: true,
    color: "purple",
  },
];

export type Value = { title: string; body: string; icon: LucideIcon };

export const values: Value[] = [
  { title: "Creatividad", body: "Ideas que se recuerdan, pero con un objetivo medible detrás.", icon: Sparkles },
  { title: "Innovación", body: "Usamos IA y automatización donde ahorran tiempo, no donde suenan bien.", icon: Lightbulb },
  { title: "Compromiso", body: "Respondemos en menos de 24 horas hábiles y cumplimos las fechas que prometemos.", icon: HeartHandshake },
  { title: "Estrategia", body: "Primero el diagnóstico y el plan; después la pauta y las publicaciones.", icon: Compass },
  { title: "Orientación a resultados", body: "Cada acción tiene un KPI y una meta que el cliente puede ver en su panel.", icon: Target },
];

export const mission =
  "Ayudar a marcas y pymes de Colombia a crecer con marketing digital que se puede medir: estrategia clara, contenido útil y reportes que muestran qué se hizo, cuánto costó y qué produjo.";

export const vision =
  "Ser en 2030 la agencia de referencia en Antioquia para marcas que quieren decidir con datos, reconocida por la transparencia de sus resultados.";

export const differentiators = [
  {
    title: "Reportes en tiempo real",
    body: "Tienes acceso a un panel con tus métricas por canal, tu avance contra la meta y el estado de cada campaña. Sin esperar el PDF de fin de mes.",
    icon: "gauge",
  },
  {
    title: "Vera, agente de IA",
    body: "Vera revisa tus datos y te dice en lenguaje sencillo qué está funcionando y qué conviene ajustar esta semana.",
    icon: "bot",
  },
  {
    title: "Estrategia antes que pauta",
    body: "No arrancamos a invertir en anuncios sin benchmark, DOFA y embudo definidos. La pauta acelera lo que ya está validado.",
    icon: "compass",
  },
  {
    title: "Equipo especializado",
    body: "Curaduría, SEO, copy y redes a cargo de una persona distinta cada uno. Sabes quién responde por qué.",
    icon: "users",
  },
] as const;

export const veraIcon = Bot;
