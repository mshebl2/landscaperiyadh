import { NextRequest, NextResponse } from 'next/server';
import PageAsset from '@/models/PageAsset';
import connectToDatabase from '@/lib/mongodb';
import {
    CACHE_DURATIONS,
    getCacheControlHeader,
    invalidateImageCache,
    invalidatePageAssetsCache,
    isAdminRequest,
} from '@/lib/cache';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const section = searchParams.get('section');

        await connectToDatabase();

        const query: any = {};
        if (page) query.page = page;
        if (section) query.section = section;

        const assets = await PageAsset.find(query).sort({ order: 1 });
        const response = NextResponse.json(assets);

        if (!isAdminRequest(request)) {
            response.headers.set(
                'Cache-Control',
                getCacheControlHeader(CACHE_DURATIONS.PAGE_ASSETS)
            );
        } else {
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        }

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Basic validation
        if (!body.page || !body.section || !body.key || !body.imageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newAsset = await PageAsset.create(body);
        invalidatePageAssetsCache();
        if (newAsset.imageUrl) {
            invalidateImageCache(newAsset.imageUrl);
        }
        return NextResponse.json(newAsset, { status: 201 });
    } catch (error) {
        console.error('Failed to create asset:', error);
        return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }
}
