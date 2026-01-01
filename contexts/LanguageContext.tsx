"use client";
import React, { createContext, useContext, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'rtl' | 'ltr';
}

const translations: Record<string, string> = {
    // Admin General
    'admin.panel': 'لوحة التحكم',
    'admin.logout': 'تسجيل الخروج',
    'admin.loading': 'جاري التحميل...',
    'admin.edit': 'تعديل',
    'admin.delete': 'حذف',
    'admin.addNew': 'إضافة جديد',
    'admin.deleteConfirm': 'هل أنت متأكد من الحذف؟',
    'admin.save': 'حفظ',
    'admin.cancel': 'إلغاء',
    'admin.created': 'تم الإنشاء بنجاح',
    'admin.updated': 'تم التحديث بنجاح',
    'admin.deleted': 'تم الحذف بنجاح',
    'admin.error': 'حدث خطأ',

    // Tabs
    'admin.tabs.projects': 'المشاريع',
    'admin.tabs.services': 'الخدمات',
    'admin.tabs.testimonials': 'آراء العملاء',
    'admin.tabs.banners': 'البنرات',
    'admin.tabs.gallery': 'معرض الصور',
    'admin.tabs.videos': 'الفيديوهات',
    'admin.tabs.blogs': 'المدونة',
    'admin.tabs.seo-config': 'إعدادات SEO',
    'admin.tabs.link-mappings': 'الروابط الداخلية',
    'admin.tabs.page-assets': 'محتوى الصفحات',
    'admin.tabs.home-slides': 'شرائح الرئيسية',

    // Login (though replaced, keeping for safety)
    'admin.login.title': 'تسجيل الدخول',
    'admin.login.subtitle': 'مرحباً بك في لوحة تحكم المسؤول',
    'admin.login.username': 'اسم المستخدم',
    'admin.login.usernamePlaceholder': 'ادخل اسم المستخدم',
    'admin.login.password': 'كلمة المرور',
    'admin.login.passwordPlaceholder': 'ادخل كلمة المرور',
    'admin.login.signingIn': 'جاري الدخول...',
    'admin.login.signIn': 'دخول',
    'admin.login.loginFailed': 'خطأ في تسجيل الدخول',
    'admin.login.errorOccurred': 'حدث خطأ',
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'ar',
    setLanguage: () => { },
    t: (key) => key,
    dir: 'rtl'
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('ar');

    const t = (key: string) => {
        return translations[key] || key;
    };

    const value = {
        language,
        setLanguage,
        t,
        dir: language === 'ar' ? 'rtl' : 'ltr' as 'rtl' | 'ltr'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
