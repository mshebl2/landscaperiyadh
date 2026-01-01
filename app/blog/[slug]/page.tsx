import { Metadata, ResolvingMetadata } from 'next';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogDetail from '@/components/BlogDetail';
import { generateSEOMetadata } from '@/lib/seo-utils';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getBlog(slug: string) {
    try {
        await connectDB();

        // 1. Try exact match
        let blog = await Blog.findOne({ slug }).lean();

        // 2. Try simple decode
        if (!blog) {
            const decodedSlug = decodeURIComponent(slug);
            blog = await Blog.findOne({ slug: decodedSlug }).lean();
        }

        // 3. Try double decode fallback for some mobile browsers
        if (!blog) {
            try {
                const doubleDecoded = decodeURIComponent(decodeURIComponent(slug));
                blog = await Blog.findOne({ slug: doubleDecoded }).lean();
            } catch (e) { }
        }

        if (!blog) return null;
        return JSON.parse(JSON.stringify(blog));
    } catch (error) {
        console.error("Error in getBlog:", error);
        return null;
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        return {
            title: 'المقال غير موجود',
        };
    }

    // Use the stored metadata or generate it dynamically
    let title = blog.metaTitle || blog.title;
    let description = blog.metaDescription || blog.excerpt;
    let keywords = blog.metaKeywords;

    // Use manual SEO if provided
    if (blog.manualSEO) {
        if (blog.manualSEO.title) title = blog.manualSEO.title;
        if (blog.manualSEO.description) description = blog.manualSEO.description;
        if (blog.manualSEO.keywords && blog.manualSEO.keywords.length > 0) keywords = blog.manualSEO.keywords;
    }

    // Auto-generate if missing
    if (!title || !description) {
        const generated = generateSEOMetadata(blog.title, blog.content, blog.excerpt);
        if (!title) title = generated.metaTitle;
        if (!description) description = generated.metaDescription;
        if (!keywords || keywords.length === 0) keywords = generated.metaKeywords;
    }

    const previousImages = (await parent).openGraph?.images || [];
    const ogImage = blog.image ? [blog.image] : previousImages;

    return {
        title: `${title} | لاندسكيب ماسترز`,
        description: description,
        keywords: keywords,
        authors: [{ name: blog.author || 'Landscape Masters' }],
        openGraph: {
            title: title,
            description: description,
            url: `https://land-masters.sa/blog/${blog.slug}`,
            siteName: 'Landscape Masters',
            images: ogImage,
            type: 'article',
            publishedTime: blog.createdAt,
            modifiedTime: blog.updatedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: ogImage,
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    return <BlogDetail blog={blog} />;
}
