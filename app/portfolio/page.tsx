"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { PLACEHOLDER_KEYS, resolvePageAssetImage } from '@/lib/pageAssets';

interface Project {
    _id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    galleryImages?: string[];
    tags: string[];
    year: string;
    link?: string;
    featured: boolean;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: string; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (counterRef.current) observer.observe(counterRef.current);
        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const endCount = parseInt(end.replace(/\D/g, ''));

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * endCount);
            setCount(currentCount);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return (
        <div ref={counterRef} className="text-4xl font-bold text-green-600 mb-2 transform hover:scale-110 transition-transform duration-300">
            {count}{suffix}
        </div>
    );
};

const Portfolio = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectPlaceholder, setProjectPlaceholder] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const [projectsRes, placeholdersRes] = await Promise.all([
                    fetch('/api/projects'),
                    fetch('/api/page-assets?page=global&section=placeholders')
                ]);
                if (!projectsRes.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await projectsRes.json();
                setProjects(data);

                if (placeholdersRes.ok) {
                    const placeholders = await placeholdersRes.json();
                    setProjectPlaceholder(resolvePageAssetImage(placeholders, PLACEHOLDER_KEYS.portfolio));
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('فشل في تحميل المشاريع');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Extract unique categories from projects
    const categories = [
        { id: 'all', name: 'جميع الأعمال' },
        ...Array.from(new Set(projects.map(p => p.category))).map(cat => {
            return {
                id: cat,
                name: cat
            };
        })
    ];

    // Helper function to get image URL (supports GridFS)
    const getImageUrl = (imageId?: string | null) => {
        if (!imageId) return '';
        // If it's already a URL, return as is
        if (imageId.startsWith('http://') || imageId.startsWith('https://') || imageId.startsWith('/')) {
            return imageId;
        }
        // Otherwise, assume it's a GridFS ID
        return `/api/images/${imageId}`;
    };

    const filteredProjects = selectedCategory === 'all'
        ? projects
        : projects.filter(project => project.category === selectedCategory);

    const openModal = (project: Project) => setSelectedImage(project);
    const closeModal = () => setSelectedImage(null);

    const nextImage = () => {
        if (!selectedImage) return;
        const currentIndex = filteredProjects.findIndex(p => p._id === selectedImage._id);
        const nextIndex = (currentIndex + 1) % filteredProjects.length;
        setSelectedImage(filteredProjects[nextIndex]);
    };

    const prevImage = () => {
        if (!selectedImage) return;
        const currentIndex = filteredProjects.findIndex(p => p._id === selectedImage._id);
        const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
        setSelectedImage(filteredProjects[prevIndex]);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">معرض الأعمال</h1>
                <p className="text-xl text-green-100 max-w-3xl mx-auto">
                    استعرض مجموعة من أفضل مشاريعنا المنفذة بأعلى معايير الجودة والإبداع
                </p>
            </section>

            {/* Filter Buttons */}
            {categories.length > 1 && (
                <section className="py-12 bg-white text-center">
                    <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto px-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category.id
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Portfolio Grid */}
            <section className="py-12 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                    {filteredProjects.map((project) => {
                        const projectImageSrc = getImageUrl(project.image) || projectPlaceholder || '';
                        return (
                            <div
                                key={project._id}
                                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                onClick={() => openModal(project)}
                            >
                                <div className="relative overflow-hidden">
                                    {projectImageSrc ? (
                                        <img
                                            src={projectImageSrc}
                                            alt={project.title}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                if (!projectPlaceholder) {
                                                    return;
                                                }
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = projectPlaceholder;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-200" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                                        <p className="text-sm text-gray-200">{project.category}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>الفئة: {project.category}</span>
                                        <span>السنة: {project.year}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">لا توجد مشاريع في هذه الفئة حالياً</p>
                    </div>
                )}
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">إنجازاتنا بالأرقام</h2>
                <p className="text-xl text-gray-600 mb-8">نفخر بما حققناه من نجاحات</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <AnimatedCounter end="500" suffix="+" duration={2500} />
                        <div className="text-gray-600">مشروع منجز</div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <AnimatedCounter end="300" suffix="+" duration={2700} />
                        <div className="text-gray-600">عميل راضي</div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <AnimatedCounter end="15" suffix="+" duration={2200} />
                        <div className="text-gray-600">سنة خبرة</div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <AnimatedCounter end="50" suffix="+" duration={2400} />
                        <div className="text-gray-600">متخصص</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">أعجبك أحد مشاريعنا؟</h2>
                <p className="text-xl text-green-100 mb-8">تواصل معنا لتنفيذ مشروع مماثل لحديقتك</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="tel:+966534309221" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105 flex items-center justify-center">
                        <Phone className="w-5 h-5 ml-2" /> اتصل الآن
                    </a>
                    <a href="https://wa.me/966534309221" className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 ml-2" /> واتساب
                    </a>
                </div>
            </section>

            {/* Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
                            <X className="w-8 h-8" />
                        </button>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10">
                            <ChevronRight className="w-8 h-8" />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10">
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        {(getImageUrl(selectedImage.image) || projectPlaceholder) ? (
                            <img
                                src={getImageUrl(selectedImage.image) || projectPlaceholder || ''}
                                alt={selectedImage.title}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onError={(e) => {
                                    if (!projectPlaceholder) {
                                        return;
                                    }
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = projectPlaceholder;
                                }}
                            />
                        ) : (
                            <div className="w-[90vw] h-[60vh] bg-gray-200 rounded-lg" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
                            <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                            <p className="text-gray-200 mb-4">{selectedImage.description}</p>
                            {selectedImage.tags && selectedImage.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedImage.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-green-600/80 px-3 py-1 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
