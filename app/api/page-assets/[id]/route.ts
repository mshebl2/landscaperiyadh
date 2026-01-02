import { NextResponse, NextRequest } from 'next/server';
import PageAsset from '@/models/PageAsset';
import connectToDatabase from '@/lib/mongodb';
import {
    CACHE_DURATIONS,
    getCacheControlHeader,
    invalidateImageCache,
    invalidatePageAssetsCache,
    isAdminRequest,
} from '@/lib/cache';

interface RouteParams {
    params: Promise<{
        id: string;
    }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        const updatedAsset = await PageAsset.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!updatedAsset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        invalidatePageAssetsCache();
        if (updatedAsset.imageUrl) {
            invalidateImageCache(updatedAsset.imageUrl);
        }

        const response = NextResponse.json(updatedAsset);
        if (isAdminRequest(request)) {
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        } else {
            response.headers.set(
                'Cache-Control',
                getCacheControlHeader(CACHE_DURATIONS.PAGE_ASSETS)
            );
        }

        return response;
    } catch (error) {
        console.error('Failed to update asset:', error);
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const deletedAsset = await PageAsset.findByIdAndDelete(id);

        if (!deletedAsset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        invalidatePageAssetsCache();
        if (deletedAsset.imageUrl) {
            invalidateImageCache(deletedAsset.imageUrl);
        }

        const response = NextResponse.json({ message: 'Asset deleted successfully' });
        if (isAdminRequest(request)) {
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        } else {
            response.headers.set(
                'Cache-Control',
                getCacheControlHeader(CACHE_DURATIONS.PAGE_ASSETS)
            );
        }

        return response;
    } catch (error) {
        console.error('Failed to delete asset:', error);
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
    }
}
