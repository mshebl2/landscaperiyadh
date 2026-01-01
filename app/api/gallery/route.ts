import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import { CACHE_DURATIONS, getCacheControlHeader, invalidateImageCache, invalidateGalleryCache, isAdminRequest } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Skip caching for admin requests
  const isAdmin = isAdminRequest(request);

  await connectDB();
  try {
    const galleryImages = await Gallery.find().sort({ order: 1, createdAt: 1 });

    const response = NextResponse.json(galleryImages);

    // Add cache headers only for non-admin requests
    if (!isAdmin) {
      response.headers.set(
        'Cache-Control',
        getCacheControlHeader(CACHE_DURATIONS.IMAGES)
      );
    } else {
      // No cache for admin
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    return response;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json();
    const { image, alt, altAr, order } = body;

    const galleryImage = await Gallery.create({
      image,
      alt,
      altAr,
      order: order || 0,
    });

    // Invalidate cache after creating gallery image
    invalidateImageCache(image);
    invalidateGalleryCache();

    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
  }
}

