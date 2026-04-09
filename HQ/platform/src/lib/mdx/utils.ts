import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  locale: string;
  tags?: string[];
  author?: string;
}

export interface Post extends PostMeta {
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    locale,
    title: data.title || slug,
    excerpt: data.excerpt || '',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    author: data.author,
    content,
  };
}

export function getAllPosts(locale: string): Post[] {
  const slugs = getPostSlugs(locale);
  return slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
