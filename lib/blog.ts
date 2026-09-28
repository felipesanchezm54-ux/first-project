import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { authors, categories, type Post, type PostMeta } from "@/lib/blog-meta";

export { categories, type Post, type PostMeta } from "@/lib/blog-meta";

const dir = path.join(process.cwd(), "content", "blog");

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx$/, "");
  const category = categories.find((c) => c.slug === data.category);
  if (!category) throw new Error(`Categoría inválida en ${file}`);
  const author = authors[data.author];
  if (!author) throw new Error(`Autor inválido en ${file}`);
  const words = content.replace(/[#>*_`[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
  const slugger = new GithubSlugger();
  const toc = content
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const text = l.replace(/^##\s+/, "").trim();
      return { id: slugger.slug(text), text };
    });
  return {
    slug,
    title: data.title,
    seoTitle: data.seoTitle ?? data.title,
    description: data.description,
    excerpt: data.excerpt ?? data.description,
    category: category.slug,
    categoryName: category.name,
    author,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt ?? data.publishedAt,
    featured: Boolean(data.featured),
    keyword: data.keyword,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    words,
    toc,
    content,
  };
}

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map(parse)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function toMeta({ content: _content, ...meta }: Post): PostMeta {
  void _content;
  return meta;
}
