'use client';

import { useState } from 'react';
import { Search, Tag } from 'lucide-react';
import { buildBlogPath } from '@/lib/site';

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    content?: string;
    processedContent?: string;
    image: string;
    author: string;
    featured: boolean;
    slug: string;
    tags?: string[];
    createdAt: string;
}

interface BlogListProps {
    initialBlogs: Blog[];
}

export default function BlogList({ initialBlogs }: BlogListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [blogs] = useState<Blog[]>(initialBlogs);

    const filteredPosts = blogs.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const featuredPost = blogs.find(blog => blog.featured) || blogs[0];
    const getPostPath = (post: Blog) => buildBlogPath((post.slug || '').trim() || post._id);

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">المدونة</h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        مقالات ونصائح متخصصة في تصميم وتنسيق الحدائق والعناية بالنباتات
                    </p>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">المقال المميز</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={featuredPost.image || '/placeholder-blog.jpg'}
                                    alt={featuredPost.title}
                                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                                />
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">{featuredPost.excerpt}</p>

                                <a
                                    href={getPostPath(featuredPost)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center no-style"
                                >
                                    اقرأ المقال كاملاً
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Search */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex-1 max-w-md mx-auto">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="ابحث في المقالات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article
                                key={post._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                            >
                                <div className="relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.image || '/placeholder-blog.jpg'}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags?.slice(0, 2).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                                                >
                                                    <Tag className="w-3 h-3 inline ml-1" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <a
                                        href={getPostPath(post)}
                                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center no-style"
                                    >
                                        اقرأ المزيد
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">لا توجد مقالات تطابق البحث</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
