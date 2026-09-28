import { ogSize, renderOg } from "@/lib/og";

export const alt = "Caso Tienda Óptica: estrategia de marketing para ópticas por NEXO";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Caso de éxito", title: "Estrategia de marketing para ópticas: el caso Tienda Óptica" });
}
