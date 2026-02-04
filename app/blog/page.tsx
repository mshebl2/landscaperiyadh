import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogList from '@/components/BlogList';
import { generateSlug } from '@/lib/seo-utils';

export const metadata: Metadata = {
    title: 'المدونة | لاندسكيب ماسترز',
    description: 'مقالات ونصائح حول تصميم وتنسيق الحدائق، أحدث الاتجاهات، ومشاريعنا في الرياض.',
};

export const dynamic = 'force-dynamic';

async function getBlogs() {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    const normalizedBlogs = [];

    for (const blog of blogs) {
        let slug = typeof blog.slug === 'string' ? blog.slug.trim() : '';

        if (!slug) {
            const titleSource = blog.title || '';
            const baseSlug = generateSlug(titleSource);
            const idString = blog._id?.toString?.() ?? String(blog._id);
            let uniqueSlug = baseSlug || `blog-${idString}`;
            let counter = 1;

            while (await Blog.findOne({ slug: uniqueSlug, _id: { $ne: blog._id } }).lean()) {
                uniqueSlug = `${baseSlug || `blog-${idString}`}-${counter}`;
                counter += 1;
            }

            await Blog.findByIdAndUpdate(blog._id, { slug: uniqueSlug });
            slug = uniqueSlug;
        }

        normalizedBlogs.push({ ...blog, slug });
    }

    return JSON.parse(JSON.stringify(normalizedBlogs));
}

export default async function BlogPage() {
    const blogs = await getBlogs();

    return <BlogList initialBlogs={blogs} />;
}
