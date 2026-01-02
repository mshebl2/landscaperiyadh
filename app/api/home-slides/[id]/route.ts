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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    try {
        const { id } = await params;
        const slide = await HomeSlide.findById(id);
        if (!slide) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        }
        const response = NextResponse.json(slide);

        if (!isAdminRequest(request)) {
            response.headers.set(
                'Cache-Control',
                getCacheControlHeader(CACHE_DURATIONS.HOME_SLIDES)
            );
        } else {
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        }

        return response;
    } catch (error) {
        console.error('Error fetching slide:', error);
        return NextResponse.json({ error: 'Failed to fetch slide' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    try {
        const { id } = await params;
        const body = await request.json();
        const slide = await HomeSlide.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!slide) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        }
        invalidateHomeSlidesCache();
        if (body.image) {
            invalidateImageCache(body.image);
        }
        return NextResponse.json(slide);
    } catch (error) {
        console.error('Error updating slide:', error);
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    try {
        const { id } = await params;
        const slide = await HomeSlide.findByIdAndDelete(id);
        if (!slide) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        }
        invalidateHomeSlidesCache();
        if (slide.image) {
            invalidateImageCache(slide.image);
        }
        return NextResponse.json({ message: 'Slide deleted successfully' });
    } catch (error) {
        console.error('Error deleting slide:', error);
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
    }
}
