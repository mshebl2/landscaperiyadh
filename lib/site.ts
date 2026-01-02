export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://almohtaref-sa.com').replace(/\/+$/g, '');

export function buildBlogUrl(slug: string): string {
  const cleanSlug = slug.replace(/^\/+/, '');
  return `${SITE_URL}/blog/${encodeURIComponent(cleanSlug)}`;
}
