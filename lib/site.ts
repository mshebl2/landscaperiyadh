export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://almohtaref-sa.com').replace(/\/+$/g, '');

export function buildBlogUrl(slug: string, baseUrl: string = SITE_URL): string {
  const cleanSlug = slug.replace(/^\/+/, '');
  let normalizedSlug = cleanSlug;
  try {
    normalizedSlug = decodeURIComponent(cleanSlug);
  } catch {
    normalizedSlug = cleanSlug;
  }
  const normalizedBase = baseUrl.replace(/\/+$/g, '');
  return `${normalizedBase}/blog/${encodeURIComponent(normalizedSlug)}`;
}
