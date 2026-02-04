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

// جلب المقالات بدون تعديل DB أثناء البناء
async function getBlogs() {
    await connectDB();

    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

    const normalizedBlogs = blogs.map((blog) => {
        // توليد slug للعرض فقط
        let slug = typeof blog.slug === 'string' ? blog.slug.trim() : '';
        if (!slug) {
            const titleSource = blog.title || '';
            const baseSlug = generateSlug(titleSource) || '';
            const idString = blog._id?.toString?.() ?? String(blog._id);
            slug = baseSlug || `blog-${idString}`;
        }

        // التأكد من ظهور المنطقة بالرياض
        const region = blog.region || 'الرياض';

        return { ...blog, slug, region };
    });

    return normalizedBlogs;
}

export default async function BlogPage() {
    const blogs = await getBlogs();
    return <BlogList initialBlogs={blogs} />;
}
