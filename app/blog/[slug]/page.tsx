import { Metadata, ResolvingMetadata } from 'next';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogDetail from '@/components/BlogDetail';
import { generateSEOMetadata } from '@/lib/seo-utils';
import { buildBlogUrl } from '@/lib/site';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getBlog(slug: string) {
    try {
        await connectDB();

        const candidates: string[] = [];
        const addCandidate = (candidate: string) => {
            if (!candidate || candidates.includes(candidate)) return;
            candidates.push(candidate);
        };

        addCandidate(slug);

        try {
            addCandidate(decodeURIComponent(slug));
        } catch { }

        try {
            addCandidate(decodeURIComponent(decodeURIComponent(slug)));
        } catch { }

        try {
            addCandidate(encodeURIComponent(slug));
        } catch { }

        for (const candidate of candidates) {
            const blog = await Blog.findOne({ slug: candidate }).lean();
            if (blog) {
                return JSON.parse(JSON.stringify(blog));
            }
        }

        const idCandidate = candidates.find((candidate) => /^[a-fA-F0-9]{24}$/.test(candidate));
        if (idCandidate) {
            const blog = await Blog.findById(idCandidate).lean();
            if (blog) {
                return JSON.parse(JSON.stringify(blog));
            }
        }

        return null;
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

    const canonicalUrl = blog.manualSEO?.canonicalUrl || buildBlogUrl(blog.slug);

    return {
        title: `${title} | لاندسكيب ماسترز`,
        description: description,
        keywords: keywords,
        authors: [{ name: blog.author || 'Landscape Masters' }],
        openGraph: {
            title: title,
            description: description,
            url: canonicalUrl,
            siteName: 'Landscape Masters',
            images: ogImage,
            type: 'article',
            publishedTime: blog.createdAt,
            modifiedTime: blog.updatedAt,
        },
        alternates: {
            canonical: canonicalUrl,
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
