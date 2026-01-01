"use client";
import React, { useState, useEffect } from 'react';
import {
    Phone,
    MessageCircle,
    Mail,
    MapPin,
    Send,
    Facebook,
    Instagram,
    Clock,
    CheckCircle
} from 'lucide-react';

interface PageAsset {
    _id: string;
    key: string;
    imageUrl: string;
    alt?: string;
    altAr?: string;
    text?: string;
    textAr?: string;
}

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: '',
        projectType: '',
        budget: '',
        timeline: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const services = [
        'تصميم وتنسيق الحدائق',
        'جلسات خارجية',
        'غرف زجاجية',
        'أحواض ديكور مع زرع طبيعي أو صناعي',
        'توريد وتركيب العشب الصناعي',
        'شلالات ونوافير بناء ثابتة',
        'شلالات ونوافير فايبر جلاس متحركة',
        'تكسيات جدارية',
        'تحت الدرج',
        'بديل الخشب بجميع الأنواع',
        'صيانة الحدائق',
        'استشارة مجانية'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                phone: '',
                email: '',
                service: '',
                message: '',
                projectType: '',
                budget: '',
                timeline: ''
            });
        }, 3000);
    };

    const contactMethods = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'اتصل بنا',
            description: 'للاستفسارات العاجلة والاستشارات المجانية',
            contact: '+966 53 430 9221',
            action: 'tel:+966534309221',
            color: 'bg-blue-500'
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: 'واتساب',
            description: 'تواصل سريع ومباشر مع فريق الخبراء',
            contact: '+966 53 430 9221',
            action: 'https://wa.me/966534309221',
            color: 'bg-green-500'
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: 'البريد الإلكتروني',
            description: 'لإرسال التفاصيل والمرفقات',
            contact: 'shazash09@gmail.com',
            action: 'mailto:shazash09@gmail.com',
            color: 'bg-red-500'
        }
    ];

    const officeHours = [
        { day: 'السبت - الأربعاء', hours: '8:00 ص - 6:00 م' },
        { day: 'الخميس', hours: '8:00 ص - 4:00 م' },
        { day: 'الجمعة', hours: 'مغلق' }
    ];

    const faqs = [
        {
            question: 'كم تستغرق مدة تنفيذ المشروع؟',
            answer: 'تختلف مدة التنفيذ حسب حجم المشروع، من أسبوع للمشاريع الصغيرة إلى عدة أشهر للمشاريع الكبيرة.'
        },
        {
            question: 'هل تقدمون ضمان على الأعمال؟',
            answer: 'نعم، نقدم ضمان شامل على جميع أعمالنا لمدة سنة كاملة.'
        },
        {
            question: 'هل الاستشارة مجانية؟',
            answer: 'نعم، نقدم استشارة مجانية وزيارة الموقع لتقييم المشروع.'
        },
        {
            question: 'هل تعملون خارج الرياض؟',
            answer: 'نعم، نخدم جميع مناطق المملكة العربية السعودية.'
        }
    ];



    const [banner, setBanner] = useState<string>('');
    const [faqAssets, setFaqAssets] = useState<PageAsset[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Banner
                const bannerRes = await fetch('/api/banners');
                const bannerData = await bannerRes.json();
                const contactBanner = bannerData.find((b: any) => b.page === 'contact');
                if (contactBanner) setBanner(contactBanner.image);

                // Fetch FAQs
                const faqRes = await fetch('/api/page-assets?page=contact&section=faq');
                if (faqRes.ok) {
                    const faqData = await faqRes.json();
                    if (faqData.length > 0) {
                        setFaqAssets(faqData);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    // Helper to determine image source
    const getImageSrc = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return `/api/images/${url}`;
    };

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section
                className={`py-20 relative text-white overflow-hidden ${!banner ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gray-900'}`}
                style={{
                    backgroundImage: banner ? `url(${getImageSrc(banner)})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {banner && <div className="absolute inset-0 bg-black/60"></div>}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        نحن هنا لمساعدتك في تحويل حلمك إلى حديقة خضراء مبهرة
                    </p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">طرق التواصل</h2>
                        <p className="text-xl text-gray-600">اختر الطريقة الأنسب لك للتواصل معنا</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {contactMethods.map((method, index) => (
                            <a
                                key={index}
                                href={method.action}
                                className="group p-8 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className={`${method.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                    {method.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{method.title}</h3>
                                <p className="text-gray-600 text-center mb-4">{method.description}</p>
                                <p className="text-green-600 font-semibold text-center">{method.contact}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form and Info */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h3>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">تم إرسال رسالتك بنجاح!</h4>
                                    <p className="text-gray-600">سنتواصل معك قريباً</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            الاسم الكامل *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                            placeholder="أدخل اسمك الكامل"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            البريد الإلكتروني *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            رقم الهاتف *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                            placeholder="05xxxxxxxx"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                                            الخدمة المطلوبة *
                                        </label>
                                        <select
                                            id="service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                        >
                                            <option value="">اختر الخدمة</option>
                                            {services.map((service, index) => (
                                                <option key={index} value={service}>
                                                    {service}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            الرسالة *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                                            placeholder="اكتب رسالتك هنا..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5 ml-2" />
                                        إرسال الرسالة
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* Office Hours */}
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Clock className="w-6 h-6 text-green-600 ml-3" />
                                    ساعات العمل
                                </h3>
                                <div className="space-y-4">
                                    {officeHours.map((schedule, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                            <span className="font-medium text-gray-900">{schedule.day}</span>
                                            <span className="text-gray-600">{schedule.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <MapPin className="w-6 h-6 text-green-600 ml-3" />
                                    موقعنا
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    الرياض، المملكة العربية السعودية
                                </p>
                                <p className="text-sm text-gray-500">
                                    نخدم جميع أنحاء الرياض
                                </p>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">تابعنا على</h3>
                                <div className="flex space-x-4 space-x-reverse">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=100081155241953&rdid=4nsrZx6e4J1bCBNz&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14Fq3Npnzrw%2F"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors duration-200"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/landscape_masters_riyadh/?igsh=dGEzazFzbXdhcG9n"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition-colors duration-200"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="https://www.tiktok.com/@landscape_masters_riyadh?_t=ZS-8yXc5Y8MbVi&_r=1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Maps Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">موقعنا على الخريطة</h2>
                        <p className="text-xl text-gray-600">نخدم جميع أنحاء الرياض والمملكة العربية السعودية</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="h-96 w-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6174478283!2d46.345928!3d24.774265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2z2KfZhNix2YrYp9i2INin2YTYs9i52YjYr9mK2Kk!5e0!3m2!1sar!2ssa!4v1640000000000!5m2!1sar!2ssa"
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
                                    <h3 className="font-semibold text-gray-900 mb-1">المنطقة الرئيسية</h3>
                                    <p className="text-gray-600 text-sm">الرياض، المملكة العربية السعودية</p>
                                </div>
                                <div>
                                    <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <h3 className="font-semibold text-gray-900 mb-1">للتواصل المباشر</h3>
                                    <p className="text-gray-600 text-sm">+966 53 430 9221</p>
                                </div>
                                <div>
                                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <h3 className="font-semibold text-gray-900 mb-1">ساعات العمل</h3>
                                    <p className="text-gray-600 text-sm">السبت - الخميس: 8:00 ص - 6:00 م</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">الأسئلة الشائعة</h2>
                        <p className="text-xl text-gray-600">إجابات على أكثر الأسئلة شيوعاً</p>
                    </div>

                    <div className="space-y-6">
                        {faqAssets.length > 0 ? (
                            faqAssets.map((faq) => (
                                <div key={faq._id} className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.altAr}</h3>
                                    <p className="text-gray-600 leading-relaxed">{faq.textAr}</p>
                                </div>
                            ))
                        ) : (
                            faqs.map((faq, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Contact CTA */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">هل تحتاج مساعدة فورية؟</h2>
                    <p className="text-xl text-green-100 mb-8">
                        تواصل معنا الآن للحصول على استشارة مجانية
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
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
