import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Blog from '@/models/Blog';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
    } catch (error) {
        console.error('Database connection failed:', error);
        throw new Error('Database connection failed');
    }
};

/**
 * Generate a URL-friendly slug from text, with proper Arabic support
 */
function generateArabicSlug(text: string): string {
    return text
        .trim()
        .replace(/[^\w\s\u0600-\u06FF-]/g, '') // Remove special chars but keep Arabic, alphanumeric, spaces, hyphens
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export async function POST() {
    try {
        await connectDB();

        const blogs = await Blog.find({}).lean();
        const results = {
            updated: [] as string[],
            skipped: [] as string[],
            errors: [] as string[],
        };

        for (const blog of blogs) {
            const oldSlug = (blog.slug || '').toString();
            const title = (blog.title || '').toString();

            // Check if current slug looks like an ID-based fallback (blog-{mongoId})
            const isIdBased = oldSlug.startsWith('blog-') && /^blog-[a-f0-9]{24}$/i.test(oldSlug);

            if (isIdBased && title) {
                try {
                    // Generate a new slug from the title with Arabic support
                    let newSlug = generateArabicSlug(title);

                    if (!newSlug) {
                        results.skipped.push(`${title} - could not generate slug`);
                        continue;
                    }

                    // Ensure uniqueness
                    let uniqueSlug = newSlug;
                    let counter = 1;
                    while (await Blog.findOne({ slug: uniqueSlug, _id: { $ne: blog._id } })) {
                        uniqueSlug = `${newSlug}-${counter}`;
                        counter++;
                    }

                    // Update the blog
                    await Blog.findByIdAndUpdate(blog._id, { slug: uniqueSlug });
                    results.updated.push(`${title}: ${oldSlug} → ${uniqueSlug}`);
                } catch (err) {
                    results.errors.push(`${title}: ${err}`);
                }
            } else {
                results.skipped.push(`${title} (slug: ${oldSlug})`);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            totalBlogs: blogs.length,
            updatedCount: results.updated.length,
            skippedCount: results.skipped.length,
            errorsCount: results.errors.length,
            details: results,
        });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json(
            { success: false, error: 'Migration failed: ' + error },
            { status: 500 }
        );
    }
}
