export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.landscaperiyadh.com').replace(/\/+$/g, '');

const normalizeSlug = (slug: string): string => {
  const cleanSlug = slug.replace(/^\/+/, '');
  try {
    return decodeURIComponent(cleanSlug);
  } catch {
    return cleanSlug;
  }
};

export function buildBlogPath(slug: string): string {
  const normalizedSlug = normalizeSlug(slug);
  return `/blog/${encodeURIComponent(normalizedSlug)}`;
}

export function buildBlogUrl(slug: string, baseUrl: string = SITE_URL): string {
  const normalizedBase = baseUrl.replace(/\/+$/g, '');
  return `${normalizedBase}${buildBlogPath(slug)}`;
}
