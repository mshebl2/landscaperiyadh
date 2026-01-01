import { NextResponse } from 'next/server';
import PageAsset from '@/models/PageAsset';
import connectToDatabase from '@/lib/mongodb';

interface RouteParams {
    params: Promise<{
        id: string;
    }>
}

export async function PUT(request: Request, { params }: RouteParams) {
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

        return NextResponse.json(updatedAsset);
    } catch (error) {
        console.error('Failed to update asset:', error);
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const deletedAsset = await PageAsset.findByIdAndDelete(id);

        if (!deletedAsset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Failed to delete asset:', error);
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
    }
}
