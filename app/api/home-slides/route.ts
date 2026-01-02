import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HomeSlide from '@/models/HomeSlide';
import {
    CACHE_DURATIONS,
    getCacheControlHeader,
    invalidateHomeSlidesCache,
    invalidateImageCache,
    isAdminRequest,
} from '@/lib/cache';

export async function GET(request: NextRequest) {
    const isAdmin = isAdminRequest(request);

    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active');

        const query = activeOnly === 'true' ? { isActive: true } : {};
        const slides = await HomeSlide.find(query).sort({ order: 1 });

        const response = NextResponse.json(slides);

        if (!isAdmin) {
            response.headers.set(
                'Cache-Control',
                getCacheControlHeader(CACHE_DURATIONS.HOME_SLIDES)
            );
        } else {
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        }

        return response;
    } catch (error) {
        console.error('Error fetching home slides:', error);
        return NextResponse.json({ error: 'Failed to fetch home slides' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const body = await request.json();
        const slide = await HomeSlide.create(body);
        invalidateHomeSlidesCache();
        if (slide.image) {
            invalidateImageCache(slide.image);
        }
        return NextResponse.json(slide, { status: 201 });
    } catch (error) {
        console.error('Error creating home slide:', error);
        return NextResponse.json({ error: 'Failed to create home slide' }, { status: 500 });
    }
}
