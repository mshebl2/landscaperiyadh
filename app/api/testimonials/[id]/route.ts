import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import {
  CACHE_DURATIONS,
  getCacheControlHeader,
  invalidateTestimonialsCache,
  isAdminRequest,
} from '@/lib/cache';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await request.json();
    const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    invalidateTestimonialsCache();

    const response = NextResponse.json(testimonial);
    
    // No cache for admin requests
    const isAdmin = isAdminRequest(request);
    if (isAdmin) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else {
      response.headers.set(
        'Cache-Control',
        getCacheControlHeader(CACHE_DURATIONS.TESTIMONIALS)
      );
    }
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    invalidateTestimonialsCache();

    const response = NextResponse.json({ message: 'Testimonial deleted successfully' });
    
    // No cache for admin requests
    const isAdmin = isAdminRequest(request);
    if (isAdmin) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else {
      response.headers.set(
        'Cache-Control',
        getCacheControlHeader(CACHE_DURATIONS.TESTIMONIALS)
      );
    }
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
