"use client";
import React, { useState, useEffect } from 'react';
import {
    TreePine, Sofa, Home, Flower, Leaf, Waves, Droplets, Palette,
    Scissors, Umbrella, Wrench, Star, MapPin, MessageCircle, Loader2,
    LucideIcon
} from 'lucide-react';
import { PLACEHOLDER_KEYS, resolvePageAssetImage } from '@/lib/pageAssets';

interface Service {
    _id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    icon: string;
    image?: string;
    features: string[];
    featuresAr: string[];
    featured: boolean;
}

interface Testimonial {
    _id: string;
    name: string;
    company?: string;
    location?: string;
    rating: number;
    text: string;
    textAr?: string;
    approved: boolean;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    'tree-pine': TreePine,
    'treepine': TreePine,
    'leaf': Leaf,
    'droplets': Droplets,
    'scissors': Scissors,
    'waves': Waves,
    'umbrella': Umbrella,
    'flower': Flower,
    'wrench': Wrench,
    'sofa': Sofa,
    'home': Home,
    'palette': Palette,
};

const Services = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [servicePlaceholder, setServicePlaceholder] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch services and testimonials from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [servicesRes, testimonialsRes, placeholdersRes] = await Promise.all([
                    fetch('/api/services'),
                    fetch('/api/testimonials'),
                    fetch('/api/page-assets?page=global&section=placeholders')
                ]);

                if (!servicesRes.ok) {
                    throw new Error('Failed to fetch services');
                }

                const servicesData = await servicesRes.json();
                setServices(servicesData);

                if (testimonialsRes.ok) {
                    const testimonialsData = await testimonialsRes.json();
                    // Filter only approved testimonials
                    setTestimonials(testimonialsData.filter((t: Testimonial) => t.approved));
                }

                if (placeholdersRes.ok) {
                    const placeholders = await placeholdersRes.json();
                    setServicePlaceholder(resolvePageAssetImage(placeholders, PLACEHOLDER_KEYS.service));
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('فشل في تحميل الخدمات');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    // Helper function to get icon component
    const getIconComponent = (iconName: string) => {
        const normalizedName = iconName?.toLowerCase().replace(/[-_\s]/g, '');
        const Icon = iconMap[normalizedName] || iconMap[iconName?.toLowerCase()] || Leaf;
        return Icon;
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ));
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
        <div className="min-h-screen pt-20 bg-gradient-to-br from-green-50 to-blue-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">خدماتنا المتميزة</h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        نقدم مجموعة شاملة من الخدمات المتخصصة في تصميم وتنسيق الحدائق والمساحات الخارجية
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid gap-8">
                    {services.map((service) => {
                        const IconComponent = getIconComponent(service.icon);
                        const serviceImageSrc = getImageUrl(service.image) || servicePlaceholder || '';

                        return (
                            <div key={service._id} id={service._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{service.titleAr}</h2>
                                            <p className="text-gray-600 mb-6 leading-relaxed">{service.descriptionAr}</p>

                                            {service.featuresAr && service.featuresAr.length > 0 && (
                                                <div className="grid md:grid-cols-2 gap-3 mb-6">
                                                    {service.featuresAr.map((feature, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span className="text-gray-700">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Service Image */}
                                            {serviceImageSrc && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                                        <img
                                                            src={serviceImageSrc}
                                                            alt={service.titleAr}
                                                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                if (!servicePlaceholder) {
                                                                    return;
                                                                }
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = servicePlaceholder;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-4">
                                    <a
                                        href="https://wa.me/966534309221"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5 ml-2" />
                                        اطلب الخدمة عبر واتساب
                                    </a>
                                </div>
                            </div>
                        );
                    })}

                    {/* Customer Reviews Section */}
                    {testimonials.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
                                    <Star className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">آراء العملاء</h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    شهادات عملائنا الكرام الذين وثقوا بخدماتنا وحصلوا على أفضل النتائج
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {testimonials.slice(0, 6).map((review) => (
                                    <div key={review._id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center ml-4">
                                                <span className="text-green-600 font-bold text-lg">
                                                    {review.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{review.name}</h4>
                                                {review.location && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 ml-1" />
                                                        {review.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex mb-3">
                                            {renderStars(review.rating)}
                                        </div>

                                        <p className="text-gray-700 italic">&quot;{review.textAr || review.text}&quot;</p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-8">
                                <a
                                    href="https://wa.me/966534309221"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
                                >
                                    <MessageCircle className="w-5 h-5 ml-2" />
                                    شاركنا رأيك عبر واتساب
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">هل تحتاج لاستشارة مجانية؟</h2>
                    <p className="text-xl mb-8">تواصل معنا الآن واحصل على استشارة مجانية من خبرائنا</p>
                    <a
                        href="https://wa.me/966534309221"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5 ml-2" />
                        تواصل معنا عبر واتساب
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Services;
