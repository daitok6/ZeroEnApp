import { getAllPosts } from '@/lib/mdx/utils';

const BASE_URL = 'https://zeroen.dev';
const FEED_TITLE = 'ZeroEn — Build in Public';
const FEED_DESC = "Follow ZeroEn's journey building AI-powered startups.";
const FEED_LANG = 'en';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const posts = getAllPosts('en');

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/en/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/en/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${BASE_URL}/en/blog</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>${FEED_LANG}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
