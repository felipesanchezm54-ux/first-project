import { ogSize, renderOg } from "@/lib/og";

export const alt = "NEXO, agencia de marketing digital en Medellín: marketing que se mide";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Marketing que se mide", title: "Agencia de marketing digital en Medellín" });
}
