import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

/**
 * Cache configuration constants
 */
export const CACHE_DURATIONS = {
  PROJECTS: 600, // 10 minutes in seconds
  SERVICES: 600, // 10 minutes in seconds
  IMAGES: 1800, // 30 minutes in seconds
  PAGE_ASSETS: 600, // 10 minutes in seconds
  HOME_SLIDES: 600, // 10 minutes in seconds
  TESTIMONIALS: 300, // 5 minutes in seconds
} as const;

/**
 * Cache tags for revalidation
 */
export const CACHE_TAGS = {
  PROJECTS: 'projects',
  SERVICES: 'services',
  IMAGES: 'images',
  BANNERS: 'banners',
  GALLERY: 'gallery',
  PAGE_ASSETS: 'page-assets',
  HOME_SLIDES: 'home-slides',
  TESTIMONIALS: 'testimonials',
} as const;

/**
 * Invalidate cache for projects
 */
export function invalidateProjectsCache() {
  revalidatePath('/api/projects');
  revalidatePath('/api/projects', 'page');
}

/**
 * Invalidate cache for services
 */
export function invalidateServicesCache() {
  revalidatePath('/api/services');
  revalidatePath('/api/services', 'page');
}

/**
 * Invalidate cache for a specific image
 */
export function invalidateImageCache(imageId: string) {
  if (!imageId) {
    return;
  }

  let path = imageId;

  if (imageId.startsWith('http')) {
    try {
      path = new URL(imageId).pathname;
    } catch {
      path = imageId;
    }
  }

  if (!path.startsWith('/')) {
    path = `/api/images/${path}`;
  }

  revalidatePath(path);
}

/**
 * Invalidate cache for banners
 */
export function invalidateBannersCache() {
  revalidatePath('/api/banners');
  revalidatePath('/api/banners', 'page');
}

/**
 * Invalidate cache for gallery
 */
export function invalidateGalleryCache() {
  revalidatePath('/api/gallery');
  revalidatePath('/api/gallery', 'page');
}

/**
 * Invalidate cache for page assets
 */
export function invalidatePageAssetsCache() {
  revalidatePath('/api/page-assets');
  revalidatePath('/api/page-assets', 'page');
}

/**
 * Invalidate cache for home slides
 */
export function invalidateHomeSlidesCache() {
  revalidatePath('/api/home-slides');
  revalidatePath('/api/home-slides', 'page');
}

/**
 * Invalidate cache for testimonials
 */
export function invalidateTestimonialsCache() {
  revalidatePath('/api/testimonials');
  revalidatePath('/api/testimonials', 'page');
}

/**
 * Get Cache-Control header value
 */
export function getCacheControlHeader(duration: number): string {
  return `public, s-maxage=${duration}, stale-while-revalidate=${duration * 2}`;
}

/**
 * Check if request is from admin
 * Checks referer header, URL pathname, and custom X-Admin-Request header
 */
export function isAdminRequest(request: NextRequest): boolean {
  const referer = request.headers.get('referer') || '';
  const adminHeader = request.headers.get('x-admin-request');
  const url = new URL(request.url);
  
  // Check if URL pathname includes /admin
  if (url.pathname.includes('/admin')) {
    return true;
  }
  
  // Check referer header
  if (referer && (referer.includes('/admin') || referer.includes('/admin/'))) {
    return true;
  }
  
  // Check custom header (can be set by admin dashboard)
  if (adminHeader === 'true') {
    return true;
  }
  
  return false;
}
