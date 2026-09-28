import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { ConsentScripts } from "@/components/layout/consent-scripts";
import { FloatingActions } from "@/components/layout/floating-actions";
import { MotionProvider } from "@/components/motion/motion-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Agencia de marketing digital en Medellín | NEXO", template: "%s | NEXO" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#03201a",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <MotionProvider>
        <a
          href="#contenido"
          className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-cta px-5 py-3 font-display font-semibold text-cta-fg transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <FloatingActions />
        <CookieBanner />
        <ConsentScripts />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        </MotionProvider>
      </body>
    </html>
  );
}
