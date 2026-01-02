'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollProgress from '@/components/animations/ScrollProgress';
import ParallaxSection from '@/components/animations/ParallaxSection';
import AnimatedText from '@/components/animations/AnimatedText';
import RippleButton from '@/components/animations/RippleButton';
import MagneticButton from '@/components/animations/MagneticButton';
import NumberCounter from '@/components/animations/NumberCounter';
import TimelineLine from '@/components/animations/TimelineLine';
import SkeletonLoader from '@/components/SkeletonLoader';

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  location?: string;
  rating: number;
  text: string;
  textAr?: string;
  approved: boolean;
}

interface Banner {
  _id: string;
  page: string;
  image: string;
}

export default function AboutUs() {
  const { t, language } = useLanguage();
  const [reviewForm, setReviewForm] = useState({
    name: '',
    company: '',
    location: '',
    rating: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [banner, setBanner] = useState<string>('/banner.webp'); // Default fallback
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Fetch banner and testimonials from backend
  useEffect(() => {
    fetchBanner();
    fetchTestimonials();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await fetch('/api/banners?page=about');
      if (!res.ok) {
        throw new Error(`Failed to fetch banner: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.length > 0 && data[0].image) {
        // Normalize banner path: if it's already a full path, use it; otherwise prepend /api/images/
        const imagePath = data[0].image;
        let normalizedPath: string;

        if (imagePath.startsWith('http')) {
          // External URL, use as-is
          normalizedPath = imagePath;
        } else if (imagePath.startsWith('/api/images/')) {
          // Already a full API path, use as-is
          normalizedPath = imagePath;
        } else if (imagePath.startsWith('/')) {
          // Local path (like /banner.webp), use as-is
          normalizedPath = imagePath;
        } else {
          // Just a fileId, prepend /api/images/
          normalizedPath = `/api/images/${imagePath}`;
        }

        setBanner(normalizedPath);
      }
    } catch (error) {
      console.error('Failed to fetch banner:', error);
      // Keep default banner on error
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?approved=true');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const testimonialData = {
        name: reviewForm.name,
        company: reviewForm.company,
        location: reviewForm.location || undefined,
        rating: parseInt(reviewForm.rating),
        text: reviewForm.message,
        textAr: language === 'ar' ? reviewForm.message : undefined,
        approved: false,
      };

      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit testimonial');
      }

      setSubmitMessage({
        type: 'success',
        text: language === 'ar'
          ? 'شكراً لك! تم إرسال مراجعتك بنجاح. سيتم مراجعتها من قبل الإدارة قبل النشر.'
          : 'Thank you! Your review has been submitted successfully. It will be reviewed by admin before being published.',
      });

      setReviewForm({
        name: '',
        company: '',
        location: '',
        rating: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
      setSubmitMessage({
        type: 'error',
        text: language === 'ar'
          ? 'حدث خطأ أثناء إرسال المراجعة. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while submitting your review. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={i < rating ? '#FFDD00' : 'none'}
            stroke="#FFDD00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </motion.svg>
        ))}
      </div>
    );
  };

  const milestones = [
    {
      year: '2015',
      title: t('aboutUs.timeline.milestones.0.title') || 'البداية',
      description: t('aboutUs.timeline.milestones.0.description') || 'انطلقت لاندسكيب ماسترز برؤية طموحة لتغيير مفهوم تنسيق الحدائق في المملكة.'
    },
    {
      year: '2018',
      title: t('aboutUs.timeline.milestones.1.title') || 'التوسع',
      description: t('aboutUs.timeline.milestones.1.description') || 'توسعنا في خدماتنا لتشمل التصاميم الهندسية وتنفيذ المشاريع الكبرى.'
    },
    {
      year: '2023',
      title: t('aboutUs.timeline.milestones.2.title') || 'الريادة',
      description: t('aboutUs.timeline.milestones.2.description') || 'أصبحنا الشركة الرائدة في الرياض مع مئات المشاريع الناجحة.'
    }
  ];

  const coreValuesData = [
    {
      title: t('aboutUs.coreValues.values.0.title') || 'الجودة',
      description: t('aboutUs.coreValues.values.0.description') || 'نلتزم بأعلى معايير الجودة في كل تفاصيل عملنا.'
    },
    {
      title: t('aboutUs.coreValues.values.1.title') || 'الإبداع',
      description: t('aboutUs.coreValues.values.1.description') || 'نبتكر تصاميم فريدة تعكس شخصية عملائنا.'
    },
    {
      title: t('aboutUs.coreValues.values.2.title') || 'الاستدامة',
      description: t('aboutUs.coreValues.values.2.description') || 'نحرص على استخدام حلول صديقة للبيئة ومستدامة.'
    },
    {
      title: t('aboutUs.coreValues.values.3.title') || 'الالتزام',
      description: t('aboutUs.coreValues.values.3.description') || 'نحترم مواعيدنا ووعودنا مع عملائنا.'
    }
  ];

  const coreValues = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17" />
          <path d="M2 12L12 17L22 12" />
        </svg>
      ),
      title: coreValuesData[0].title,
      description: coreValuesData[0].description,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
          <path d="M12 6V12L16 14" />
        </svg>
      ),
      title: coreValuesData[1].title,
      description: coreValuesData[1].description,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12L11 14L15 10" />
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
        </svg>
      ),
      title: coreValuesData[2].title,
      description: coreValuesData[2].description,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" />
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" />
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" />
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" />
        </svg>
      ),
      title: coreValuesData[3].title,
      description: coreValuesData[3].description,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <>
      <ScrollProgress />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-black safe-area-left safe-area-right">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <Image
            src={banner}
            alt="Concrete architecture background"
            fill
            priority
            className="object-cover"
            key={banner}
            unoptimized
            onError={(e) => {
              console.error('Banner image failed to load:', banner);
              // Fallback to default banner
              e.currentTarget.src = '/banner.webp';
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#FFDD00]/10 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFDD00]/5 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-[min(1400px,95vw)] px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 text-center safe-area-left safe-area-right"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-4 sm:mb-6"
            >
              <div className="w-6 sm:w-8 h-px bg-[#FFDD00] origin-left" />
              <AnimatedText
                type="fade"
                delay={0.3}
                className="text-xs sm:text-sm uppercase tracking-wider text-white/85"
              >
                {t('aboutUs.hero.subtitle')}
              </AnimatedText>
              <div className="w-6 sm:w-8 h-px bg-[#FFDD00] origin-right" />
            </motion.div>
            <h1 className="text-[clamp(1.875rem,7vw,4.375rem)] font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight text-overflow-safe">
              <AnimatedText type="word" delay={0.4} className="block">
                {t('aboutUs.hero.title')}
              </AnimatedText>
              <br />
              <AnimatedText
                type="word"
                delay={0.6}
                className="text-[#FFDD00]"
              >
                {t('aboutUs.hero.titleHighlight')}
              </AnimatedText>
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-[min(48rem,90vw)] mx-auto leading-relaxed px-4 text-overflow-safe"
              style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)' }}
            >
              <AnimatedText type="fade" delay={0.8} className="inline-block w-full text-center">
                {t('aboutUs.hero.description')}
              </AnimatedText>
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8 sm:mt-10"
            >
              <MagneticButton
                href="/contact"
                className="inline-block bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFDD00]/30 uppercase tracking-wide button-slide"
              >
                {t('aboutUs.cta.button')}
              </MagneticButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-b from-black via-gray-900 to-black text-white safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#FFDD00]" />
              <span className="text-sm uppercase tracking-wider text-white/85">{t('aboutUs.statistics.subtitle')}</span>
              <div className="w-8 h-px bg-[#FFDD00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('aboutUs.statistics.title')}</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: 500, suffix: '+', labelKey: 'projectsCompleted' },
              { value: 10, suffix: '+', labelKey: 'yearsExperience' },
              { value: 24, suffix: '/7', labelKey: 'hourService' },
              { value: 100, suffix: '%', labelKey: 'clientSatisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  borderColor: 'rgba(255, 221, 0, 0.5)',
                  boxShadow: '0 20px 40px rgba(255, 221, 0, 0.15)'
                }}
                className="text-center p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 transition-all duration-300 ease-out cursor-default"
              >
                <NumberCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-4xl md:text-5xl font-bold text-[#FFDD00] mb-2"
                />
                <p className="text-sm md:text-base text-white/85 uppercase tracking-wide">{t(`aboutUs.statistics.stats.${stat.labelKey}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 32 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="h-px bg-[#FFDD00]"
                />
                <span className="text-sm uppercase tracking-wider text-white/85">{t('aboutUs.whoWeAre.subtitle')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <AnimatedText type="word" delay={0.1}>
                  {t('aboutUs.whoWeAre.title')}
                </AnimatedText>
              </h2>
              <div className="space-y-4 text-lg text-white/80 leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="blur-to-focus"
                >
                  {t('aboutUs.whoWeAre.paragraph1')}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="blur-to-focus"
                >
                  {t('aboutUs.whoWeAre.paragraph2')}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="blur-to-focus"
                >
                  {t('aboutUs.whoWeAre.paragraph3')}
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { src: '/WhatsApp Image 2025-11-11 at 18.29.40_7cb1596f.webp', altKey: 'doorWindowOpening', delay: 0, className: '' },
                  { src: '/DeliberateService.webp', altKey: 'concreteCutting', delay: 0.1, className: '-mt-8' },
                  { src: null, delay: 0.2, className: '' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    className={`relative aspect-square rounded-xl overflow-hidden border border-gray-800 ${item.className}`}
                  >
                    {item.src ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={item.src}
                          alt={item.altKey ? t(`aboutUs.whoWeAre.images.${item.altKey}`) : ''}
                          fill
                          sizes="(min-width: 768px) 50vw, 50vw"
                          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        />
                      </motion.div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFDD00]/20 to-transparent flex items-center justify-center">
                        <div className="text-center p-6">
                          <NumberCounter
                            value={500}
                            suffix="+"
                            className="text-4xl font-bold text-[#FFDD00] mb-2"
                          />
                          <div className="text-sm text-white/80 uppercase tracking-wide">{t('aboutUs.whoWeAre.projectsCompleted')}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white relative safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#FFDD00]" />
              <span className="text-sm uppercase tracking-wider text-white/85">{t('aboutUs.timeline.subtitle')}</span>
              <div className="w-8 h-px bg-[#FFDD00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('aboutUs.timeline.title')}</h2>
            <p className="text-white/85 max-w-2xl mx-auto">
              {t('aboutUs.timeline.description')}
            </p>
          </motion.div>

          <div className="relative">
            <TimelineLine totalItems={milestones.length} />

            <div className="space-y-12 md:space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                    className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#FFDD00] border-4 border-black transform md:-translate-x-1/2 z-10 animate-pulse-glow"
                  />

                  {/* Year Badge */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.2, type: 'spring', stiffness: 150 }}
                      className="inline-block bg-gradient-to-br from-[#FFDD00] to-[#FFE640] text-black px-6 py-2 rounded-full font-bold text-lg"
                    >
                      {milestone.year}
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <motion.div
                      whileHover={{
                        scale: 1.03,
                        borderColor: 'rgba(255, 221, 0, 0.5)',
                        y: -4,
                        boxShadow: '0 12px 24px rgba(255, 221, 0, 0.15)'
                      }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-gray-900 rounded-xl p-6 border border-gray-800 transition-all duration-300 cursor-default"
                    >
                      <h3 className="text-xl font-bold mb-2 text-[#FFDD00]">{milestone.title}</h3>
                      <p className="text-white/80 leading-relaxed">{milestone.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-b from-black to-gray-900 text-white safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#FFDD00]" />
              <span className="text-sm uppercase tracking-wider text-white/85">{t('aboutUs.missionVision.subtitle')}</span>
              <div className="w-8 h-px bg-[#FFDD00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('aboutUs.missionVision.title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {[
              {
                title: t('aboutUs.missionVision.mission.title'),
                description: t('aboutUs.missionVision.mission.description'),
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                  </svg>
                ),
                gradient: 'from-blue-500/20 to-cyan-500/20',
                delay: 0,
              },
              {
                title: t('aboutUs.missionVision.vision.title'),
                description: t('aboutUs.missionVision.vision.description'),
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
                    <path d="M12 6V12L16 14" />
                  </svg>
                ),
                gradient: 'from-purple-500/20 to-pink-500/20',
                delay: 0.2,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: item.delay }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  borderColor: 'rgba(255, 221, 0, 0.5)',
                  boxShadow: '0 20px 40px rgba(255, 221, 0, 0.15)',
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                }}
                className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-10 border border-gray-800 transition-all duration-300 overflow-hidden cursor-default"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay + 0.2, type: 'spring', stiffness: 150 }}
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                  }}
                  className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'} w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center transition-transform duration-300`}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#FFDD00]">{item.title}</h3>
                <p className="text-lg text-white/80 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us / Core Values Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#FFDD00]" />
              <span className="text-sm uppercase tracking-wider text-white/85">{t('aboutUs.coreValues.subtitle')}</span>
              <div className="w-8 h-px bg-[#FFDD00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('aboutUs.coreValues.title')}</h2>
            <p className="text-white/85 max-w-2xl mx-auto">
              {t('aboutUs.coreValues.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y: -10,
                  scale: 1.04,
                  rotateY: 5,
                  borderColor: 'rgba(255, 221, 0, 0.5)',
                  boxShadow: '0 20px 40px rgba(255, 221, 0, 0.2)'
                }}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 transition-all duration-300 overflow-hidden cursor-default"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                    whileHover={{
                      rotate: 360,
                      scale: 1.2,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} mb-4 transition-transform duration-300 cursor-default`}
                  >
                    <div className="text-white">
                      {value.icon}
                    </div>
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold mb-3 transition-colors duration-300"
                    whileHover={{ color: '#FFDD00' }}
                  >
                    {value.title}
                  </motion.h3>
                  <p className="text-white/85 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews & Testimonials Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#FFDD00]" />
              <span className="text-sm uppercase tracking-wider text-white/85">{t('aboutUs.reviews.subtitle')}</span>
              <div className="w-8 h-px bg-[#FFDD00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#FFDD00]">
              {t('aboutUs.reviews.title')}
            </h2>
            <p className="text-white/85 max-w-2xl mx-auto">
              {t('aboutUs.reviews.description')}
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              <SkeletonLoader variant="testimonial" count={6} />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 mb-16">
              <div className="text-white/80">{language === 'ar' ? 'لا توجد مراجعات متاحة حالياً' : 'No testimonials available at the moment'}</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.3, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                    rotateY: 2,
                    borderColor: 'rgba(255, 221, 0, 0.5)',
                    boxShadow: '0 20px 40px rgba(255, 221, 0, 0.15)'
                  }}
                  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 md:p-8 border border-gray-800 transition-all duration-300 cursor-default"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFDD00]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    <p className="text-white/90 leading-relaxed mb-6 text-sm md:text-base">
                      "{language === 'ar' && testimonial.textAr ? testimonial.textAr : testimonial.text}"
                    </p>

                    <div className="border-t border-gray-800 pt-4">
                      <p className="font-semibold text-[#FFDD00] mb-1">{testimonial.name}</p>
                      <p className="text-sm text-white/85">{testimonial.company}</p>
                      {testimonial.location && (
                        <p className="text-xs text-white/75 mt-1">{testimonial.location}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Review Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl p-8 md:p-12 border border-gray-800 shadow-2xl glass-effect">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFDD00]/5 via-transparent to-transparent rounded-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-[#FFDD00]">{t('aboutUs.reviews.form.title')}</h3>
                  <p className="text-white/85">{t('aboutUs.reviews.form.subtitle')}</p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { name: 'name', label: t('aboutUs.reviews.form.name'), placeholder: t('aboutUs.reviews.form.namePlaceholder'), type: 'text' },
                      { name: 'company', label: t('aboutUs.reviews.form.company'), placeholder: t('aboutUs.reviews.form.companyPlaceholder'), type: 'text' },
                    ].map((field) => (
                      <div key={field.name} className="relative">
                        <label htmlFor={`review${field.name}`} className="block text-sm font-medium mb-2 text-white/90">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          id={`review${field.name}`}
                          name={field.name}
                          value={reviewForm[field.name as keyof typeof reviewForm]}
                          onChange={handleReviewChange}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all duration-300 ease-out ${focusedField === field.name
                              ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20 scale-[1.02]'
                              : 'border-gray-700 hover:border-gray-600 hover:scale-[1.01]'
                            }`}
                          placeholder={field.placeholder}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <label htmlFor="reviewLocation" className="block text-sm font-medium mb-2 text-white/90">
                      {language === 'ar' ? 'الموقع (اختياري)' : 'Location (Optional)'}
                    </label>
                    <input
                      type="text"
                      id="reviewLocation"
                      name="location"
                      value={reviewForm.location}
                      onChange={handleReviewChange}
                      onFocus={() => setFocusedField('location')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all duration-300 ease-out ${focusedField === 'location'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20 scale-[1.02]'
                          : 'border-gray-700 hover:border-gray-600 hover:scale-[1.01]'
                        }`}
                      placeholder={language === 'ar' ? 'مثال: جدة' : 'e.g., Jeddah'}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="reviewRating" className="block text-sm font-medium mb-2 text-white/90">
                      {t('aboutUs.reviews.form.rating')}
                    </label>
                    <select
                      id="reviewRating"
                      name="rating"
                      value={reviewForm.rating}
                      onChange={handleReviewChange}
                      onFocus={() => setFocusedField('rating')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3.5 text-white focus:outline-none transition-all duration-300 ease-out ${focusedField === 'rating'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20 scale-[1.02]'
                          : 'border-gray-700 hover:border-gray-600 hover:scale-[1.01]'
                        }`}
                      required
                    >
                      <option value="">{t('aboutUs.reviews.form.ratingPlaceholder')}</option>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {t(`aboutUs.reviews.form.ratingOptions.${rating}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label htmlFor="reviewMessage" className="block text-sm font-medium mb-2 text-white/90">
                      {t('aboutUs.reviews.form.message')}
                    </label>
                    <textarea
                      id="reviewMessage"
                      name="message"
                      value={reviewForm.message}
                      onChange={handleReviewChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={5}
                      className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all duration-300 resize-none ease-out ${focusedField === 'message'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20 scale-[1.01]'
                          : 'border-gray-700 hover:border-gray-600 hover:scale-[1.005]'
                        }`}
                      placeholder={t('aboutUs.reviews.form.messagePlaceholder')}
                      required
                    />
                  </div>

                  {submitMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl ${submitMessage.type === 'success'
                          ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                          : 'bg-red-500/20 border border-red-500/50 text-red-400'
                        }`}
                    >
                      {submitMessage.text}
                    </motion.div>
                  )}

                  <RippleButton
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFDD00]/30 uppercase tracking-wide text-sm ${submitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {submitting
                      ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                      : t('aboutUs.reviews.form.submit')}
                  </RippleButton>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl p-12 md:p-16 border border-gray-800 overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFDD00]/10 via-transparent to-transparent pointer-events-none animate-gradient" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <AnimatedText type="word" delay={0.1}>
                  {t('aboutUs.cta.title')}
                </AnimatedText>
              </h2>
              <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto">
                <AnimatedText type="fade" delay={0.3} className="inline-block w-full text-center">
                  {t('aboutUs.cta.description')}
                </AnimatedText>
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                <MagneticButton
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFDD00]/30 uppercase tracking-wide button-slide"
                >
                  {t('aboutUs.cta.button')}
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
