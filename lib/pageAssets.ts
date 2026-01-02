import { getImageUrl } from '@/lib/imageUtils';

export const PLACEHOLDER_KEYS = {
  service: 'service-placeholder',
  portfolio: 'portfolio-placeholder',
} as const;

export interface PageAssetImage {
  key: string;
  imageUrl?: string;
}

export function resolvePageAssetImage(
  assets: PageAssetImage[],
  key: string
): string | null {
  const match = assets.find((asset) => asset.key === key);
  if (!match?.imageUrl) {
    return null;
  }
  return getImageUrl(match.imageUrl);
}
