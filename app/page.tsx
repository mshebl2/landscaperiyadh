"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowDown, Leaf, Phone, MessageCircle, MapPin, ChevronLeft, ChevronRight, Loader2, Users, Star, ShieldCheck, Clock } from 'lucide-react';

interface HomeSlide {
  _id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface Service {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image?: string;
}

interface Project {
  _id: string;
  title: string;
  titleAr: string;
  image: string;
}

interface PageAsset {
  _id: string;
  key: string;
  imageUrl: string;
  alt?: string;
  altAr?: string;
  text?: string;
  textAr?: string;
}

// Default slides (fallback if no data in DB)
const defaultSlides = [
  {
    _id: '1',
    image: '/1.jpg',
    title: 'Luxury Garden Design',
    titleAr: 'تصميم حدائق فاخرة',
    subtitle: 'Palace gardens with wooden pergolas and waterfalls',
    subtitleAr: 'حدائق قصور مع برجولات خشبية وشلالات',
    order: 0,
    isActive: true
  },
  {
    _id: '2',
    image: '/2.jpg',
    title: 'Luxury Outdoor Seating',
    titleAr: 'جلسات خارجية فاخرة',
    subtitle: 'Elegant relaxation spaces with modern furniture',
    subtitleAr: 'مساحات استرخاء أنيقة مع أثاث عصري',
    order: 1,
    isActive: true
  },
  {
    _id: '3',
    image: '/3.jpg',
    title: 'Stunning Waterfalls and Fountains',
    titleAr: 'شلالات ونوافير مبهرة',
    subtitle: 'Water features that add luxury and tranquility',
    subtitleAr: 'عناصر مائية تضيف الفخامة والهدوء',
    order: 2,
    isActive: true
  },
  {
    _id: '4',
    image: '/4.jpg',
    title: 'Professional Artificial Grass',
    titleAr: 'عشب صناعي احترافي',
    subtitle: 'Gardens with international standards',
    subtitleAr: 'حدائق بمعايير عالمية',
    order: 3,
    isActive: true
  },
  {
    _id: '5',
    image: '/5.jpg',
    title: 'Modern Smart Technologies',
    titleAr: 'تقنيات ذكية حديثة',
    subtitle: 'Smart irrigation systems and modern glass rooms',
    subtitleAr: 'أنظمة ري ذكية وغرف زجاجية عصرية',
    order: 4,
    isActive: true
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HomeSlide[]>(defaultSlides);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [whyChooseUsAssets, setWhyChooseUsAssets] = useState<PageAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image URL (supports GridFS)
  const getImageUrl = (imageId: string | undefined) => {
    if (!imageId) return '/placeholder.jpg';
    // If it's already a URL or local path, return as is
    if (imageId.startsWith('http://') || imageId.startsWith('https://') || imageId.startsWith('/')) {
      return imageId;
    }
    // Otherwise, assume it's a GridFS ID
    return `/api/images/${imageId}`;
  };

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [slidesRes, servicesRes, projectsRes, whyChooseUsRes] = await Promise.all([
          fetch('/api/home-slides?active=true').catch(() => null),
          fetch('/api/services?featured=true').catch(() => null),
          fetch('/api/projects?featured=true').catch(() => null),
          fetch('/api/page-assets?page=home&section=why-choose-us').catch(() => null)
        ]);

        // Handle slides
        if (slidesRes?.ok) {
          const slidesData = await slidesRes.json();
          if (slidesData.length > 0) {
            setSlides(slidesData);
          }
        }

        // Handle services
        if (servicesRes?.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData.slice(0, 3)); // Get top 3 featured services
        }

        // Handle projects
        if (projectsRes?.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.slice(0, 3)); // Get top 3 featured projects
        }

        // Handle Why Choose Us assets
        if (whyChooseUsRes?.ok) {
          setWhyChooseUsAssets(await whyChooseUsRes.json());
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const whyChooseUs = [
    { title: 'خبرة 15+ سنة', description: 'رواد في مجال تنسيق الحدائق بالرياض' },
    { title: 'فريق متخصص', description: 'مهندسون وخبراء في التصميم والتنفيذ' },
    { title: 'جودة استثنائية', description: 'أفضل المواد والتقنيات العالمية' },
    { title: 'ضمان شامل', description: 'ضمان على جميع الأعمال والخدمات' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Slider Container */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide._id}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={getImageUrl(slide.image)}
                alt={slide.titleAr}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-16 h-16 text-green-400 animate-pulse" />
          </div>

          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              لاندسكيب ماسترز
            </h1>
            <p className="text-2xl md:text-3xl text-green-300 font-semibold">
              الرياض
            </p>
          </div>

          <p className="text-2xl md:text-3xl mb-8 text-gray-200 leading-relaxed font-semibold">
            نحول أحلامك إلى واحات خضراء مبهرة
          </p>

          {/* Current Slide Info */}
          <p className="text-xl md:text-2xl mb-8 text-green-300 font-semibold">
            {slides[currentSlide]?.subtitleAr}
          </p>

          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            الشركة الرائدة في تصميم وتنسيق الحدائق الفاخرة بالرياض، نبدع حلولاً مبتكرة تجمع بين الفخامة والجمال الطبيعي
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/services"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              اكتشف خدماتنا
            </Link>
            <Link
              href="/portfolio"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              معرض الأعمال
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">أهم خدماتنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات المتخصصة في تصميم وتنسيق الحدائق
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {services.length > 0 ? (
                services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(service.image)}
                        alt={service.titleAr}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
                        }}
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.titleAr}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">{service.descriptionAr}</p>
                      <Link
                        href="/services"
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                      >
                        اطلب الخدمة
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback static services if none in DB
                <>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                    <div className="relative overflow-hidden">
                      <img src="/11.jpg" alt="تصميم حدائق" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">تصميم وتنسيق الحدائق الفاخرة</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">تصاميم مبتكرة وعصرية تحول مساحتك إلى واحة خضراء مبهرة</p>
                      <Link href="/services" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
                        اطلب الخدمة
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                    <div className="relative overflow-hidden">
                      <img src="/IMG-20250930-WA0102.jpg" alt="جلسات خارجية" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">جلسات خارجية وغرف زجاجية</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">مساحات استرخاء فاخرة مع أثاث عصري وغرف زجاجية</p>
                      <Link href="/services" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
                        اطلب الخدمة
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                    <div className="relative overflow-hidden">
                      <img src="/10.jpg" alt="شلالات ونوافير" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">شلالات ونوافير فاخرة</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">عناصر مائية مذهلة تضيف لمسة من الفخامة والهدوء</p>
                      <Link href="/services" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
                        اطلب الخدمة
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/services"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105"
            >
              عرض جميع الخدمات
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لمحة عن معرض الأعمال</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              استعرض مجموعة من أفضل مشاريعنا المنفذة بأعلى معايير الجودة
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(project.image)}
                        alt={project.titleAr}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-bold">{project.titleAr}</h3>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback static projects if none in DB
                <>
                  <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src="/IMG-20250930-WA0021.jpg" alt="حديقة فيلا فاخرة" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-bold">حديقة فيلا فاخرة - الرياض</h3>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src="/IMG-20250930-WA0083.jpg" alt="جلسة خارجية فاخرة" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-bold">جلسة خارجية فاخرة</h3>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src="/12.jpg" alt="شلال ثابت" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-bold">شلال ثابت مع إضاءة</h3>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/portfolio"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105"
            >
              عرض معرض الأعمال كاملاً
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا يختارنا العملاء؟</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نتميز بالخبرة والاحترافية والجودة العالية في جميع خدماتنا
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {whyChooseUsAssets.length > 0 ? (
              whyChooseUsAssets.map((asset) => {
                const iconMap: { [key: string]: any } = {
                  'leaf': Leaf,
                  'users': Users,
                  'star': Star,
                  'shield-check': ShieldCheck,
                  'clock': Clock,
                };
                const IconComponent = iconMap[asset.imageUrl] || Leaf;

                return (
                  <div
                    key={asset._id}
                    className="text-center p-6 bg-white rounded-xl hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{asset.altAr}</h3>
                    <p className="text-gray-600 text-sm">{asset.textAr}</p>
                  </div>
                );
              })
            ) : (
              whyChooseUs.map((reason, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
                  <p className="text-gray-600 text-sm">{reason.description}</p>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              href="/about"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105"
            >
              تعرف علينا أكثر
            </Link>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">موقعنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نخدم جميع أنحاء الرياض
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463878.29488595825!2d46.82252880000001!3d24.725191849999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2z2KfZhNix2YrYp9i2INin2YTYs9i52YjYr9mK2Kk!5e0!3m2!1sar!2seg!4v1759314685558!5m2!1sar!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع لاندسكيب ماسترز بالرياض"
              ></iframe>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">نخدم جميع أنحاء الرياض</h3>
                </div>
                <div>
                  <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">اتصل بنا الآن</h3>
                  <p className="text-gray-600 text-sm">+966 53 430 9221</p>
                </div>
                <div>
                  <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">واتساب</h3>
                  <p className="text-gray-600 text-sm">تواصل سريع ومباشر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">جاهز لتحويل حديقتك؟</h2>
          <p className="text-xl text-green-100 mb-8">
            تواصل معنا اليوم واحصل على استشارة مجانية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+966534309221"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 ml-2" />
              اتصل الآن
            </a>
            <a
              href="https://wa.me/966534309221"
              className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              واتساب
            </a>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
