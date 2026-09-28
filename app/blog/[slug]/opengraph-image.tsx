import { getAllPosts, getPost } from "@/lib/blog";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Artículo del blog de marketing digital de NEXO";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOg({ eyebrow: `Blog · ${post?.categoryName ?? ""}`, title: post?.title ?? "Blog de marketing digital" });
}
