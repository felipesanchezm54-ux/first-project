import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { PostCard } from "@/components/blog/post-card";
import { PostFilter } from "@/components/blog/post-filter";
import { LazyNewsletterForm } from "@/components/lazy/lazy-forms";
import { getAllPosts, toMeta } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog de marketing digital para marcas | NEXO",
  description:
    "Blog de marketing digital de NEXO: respuestas concretas sobre redes sociales, pauta, embudos y datos para marcas y pymes en Colombia. Lee y aplica hoy.",
  path: "/blog",
  keywords: ["blog de marketing digital", "consejos de marketing para pymes"],
});

export default function BlogPage() {
  const posts = getAllPosts().map(toMeta);
  const featured = posts.find((p) => p.featured) ?? posts[0];

  return (
    <>
      <PageHero
        crumbs={[{ name: "Blog", path: "/blog" }]}
        eyebrow="Blog"
        title={
          <>
            Blog de marketing digital: <span className="text-gradient">respuestas, no relleno</span>
          </>
        }
        lead={<p>Cada artículo responde una pregunta que nos hacen los clientes, con la respuesta corta primero y el detalle después.</p>}
      />

      <Section tone="light" labelledBy="destacado">
        <SectionHeading id="destacado" eyebrow="Artículo destacado" title="Empieza por aquí" />
        <div className="mt-8">
          <PostCard post={featured} featured />
        </div>
      </Section>

      <Section labelledBy="todos">
        <SectionHeading
          id="todos"
          eyebrow="Todos los artículos"
          title="Filtra por el tema que te interesa"
          answer="Cuatro categorías: marketing digital, redes sociales, publicidad digital y consejos para marcas."
        />
        <div className="mt-10">
          <PostFilter posts={posts} />
        </div>
      </Section>

      <section aria-labelledby="newsletter-blog" className="pb-24">
        <div className="container-nexo">
          <div className="card grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
            <div>
              <h2 id="newsletter-blog" className="text-h2 font-bold">
                Recibe un artículo al mes
              </h2>
              <p className="mt-3 text-muted">Solo cuando publicamos algo nuevo. Te puedes dar de baja con un clic.</p>
            </div>
            <LazyNewsletterForm source="blog" labelledBy="newsletter-blog" />
          </div>
        </div>
      </section>
    </>
  );
}
